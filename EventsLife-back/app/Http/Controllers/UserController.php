<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Stripe\Stripe;
use Stripe\Account;
use Stripe\AccountLink;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use Stripe\Checkout\Session;
use Illuminate\Support\Str;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(User::all());
    }
	public function getById($id): JsonResponse {
    	
    	$user = User::find($id);

    	if (!$user) {
        	return response()->json(['message' => 'Usuario no encontrado'], 404);
    	}
    	return response()->json($user);
	}

	//funcion para el usuario organizador de Stripe:
	public function createAccountLink(Request $request){
		$userId = $request->input('userId');
		$user = User::findOrFail($userId);

		//Mi clave secreta de stripe que está en el .env
		Stripe::setApiKey(env('STRIPE_SECRET'));

		try {
			$accountId = $user->stripeAccountId;

			// Si no hay cuenta Stripe, se crea una 
			if (!$accountId) {
				$account = Account::create([
					'type' => 'express',
				]);
				$accountId = $account->id;
			}

			$accountLink = AccountLink::create([
				'account' => $accountId,
				'return_url' => "http://localhost:64308/#/success/account/{$accountId}",
				'refresh_url' => "http://localhost:64308/#/profile",
				'type' => 'account_onboarding',
			]);

			return response()->json([
				'url' => $accountLink->url,
				'accountId' => $accountId,
			]);
		} catch (\Exception $e) {
			Log::error('Error al crear cuenta Stripe: ' . $e->getMessage());

			return response()->json([
				'error' => 'Error creando cuenta Stripe',
				'message' => $e->getMessage(),
			], 500);
		}
	}

	public function createCheckoutSession(Request $request){
        $name = $request->input('productTitle');
        $precio = $request->input('productPrice'); 
        $sellerStripeId = $request->input('sellerStripeId');
        $productId = $request->input('productId');
		$userId =$request->input('userId');

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $session = Session::create([
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => $name,
                        ],
                        'unit_amount' => round($precio * 100), // convertir euros a céntimos
                    ],
                    'quantity' => 1,
                ]],
                'payment_intent_data' => [
                    'transfer_data' => [
                        'destination' => $sellerStripeId,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => "http://localhost:64308/#/success/product/{$productId}",
                'cancel_url' => "http://localhost:64308/#/home",
            ]);

            return response()->json(['url' => $session->url]);

        } catch (\Exception $e) {
            Log::error('Error al crear sesión de pago: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

	//Función para guardar el StripeId del usuario si es que el registro en Stripe fue valido
	public function setStripeAccount(Request $request){
		try {
			$userId = $request->input('userId');
			$stripeId = $request->input('stripeId');

			$user = User::findOrFail($userId);

			$user->stripeAccountId = $stripeId;
			$user->save();

			
			return response()->json([
				'message' => 'Cuenta Stripe vinculada correctamente.',
			]);
		} catch (\Exception $e) {
			Log::error('Error al vincular cuenta Stripe: ' . $e->getMessage());

			return response()->json([
				'error' => 'Error vinculando cuenta Stripe',
				'message' => $e->getMessage(),
			], 500);
		}
	}
	
	public function setEventToHistory(Request $request){
		$userId = $request->input('userId');
		$eventId = $request->input('eventId');

		$user = User::find($userId);

		if (!$user) {
			return response()->json([
				'message' => 'Usuario no encontrado',
				'user' => $userId
			], 404);
		}

		$history = $user->history;		
		$alreadyExists = collect($history)->contains(function ($entry) use ($eventId) {
			return isset($entry['eventId']) && $entry['eventId'] == $eventId;
		});

		if (!$alreadyExists) {
			$followCode = Str::uuid()->toString();
	
			$history[] = [
				'eventId' => $eventId,
				'code' => $followCode
			];
	
			$user->history = $history;
			$user->save();
	
			return response()->json([
				'message' => 'Evento añadido correctamente',
				'user' => $user,
				'followCode' => $followCode
			], 200);
		}

		return response()->json([
			'message' => 'El evento ya está en el historial',
			'user' => $user,
		], 200);
	}

	public function getHistoryEventsByUser($userId){
		$user = User::find($userId);

		if (!$user) {
			return response()->json(['message' => 'Usuario no encontrado'], 404);
		}

		$historyIds = $user->history;

		if (empty($historyIds)) {
			return response()->json(['events' => []], 200);
		}
		//Saco los id del array de eventos
		$eventIds = collect($historyIds)->pluck('eventId')->all();

		$events = Event::whereIn('id', $eventIds)->get();

		if ($events->isEmpty()) {
			return response()->json(['message' => 'Eventos no encontrados'], 404);
		}

		return response()->json(['events' => $events], 200);
	}
	
	public function addEventToCart($eventId, $userId){
		$user = User::findOrFail($userId);

		$cart = $user->events_ids;

		if (!in_array($eventId, $cart)) {
			$cart[] = $eventId;
			$user->events_ids = $cart;
			$user->save();
		}else{
			return response()->json(['message' => 'Evento duplicado en el carrito']);
		}

		return response()->json(['message' => 'Evento añadido al carrito', 'cart' => $user->events_ids]);
	}

	public function deleteFromCart($userId,$eventId){
		$user = User::findOrFail($userId);

		$cart = $user->events_ids ?? [];

		if (in_array($eventId, $cart)) {
			$cart = array_filter($cart, function ($id) use ($eventId) {
				return $id != $eventId;
			});
			$cart = array_values($cart);

			$user->events_ids = $cart;
			$user->save();
		}

		return response()->json(['message' => 'Evento eliminado del carrito', 'cart' => $user->events_ids]);
	}
	
	public function getCart($userId){
		$user = User::find($userId);

		if (!$user) {
			return response()->json(['message' => 'Usuario no encontrado'], 404);
		}

		$eventIds = $user->events_ids ?? [];

		if (empty($eventIds)) {
			return response()->json(['events' => []], 200);
		}

		$events = Event::whereIn('id', $eventIds)->get();

		return response()->json(['events' => $events], 200);
	}

	public function deleteEventFromCart($userId, $eventId){
		$user = User::find($userId);

		if (!$user) {
			return response()->json(['message' => 'Usuario no encontrado'], 404);
		}
		$events = $user->events_ids;
		$key = array_search($eventId, $events);

		if ($key !== false) {
			unset($events[$key]);
			$events = array_values($events); 
		}

		$user->events_ids = $events;
		$user->save();

		return response()->json([
			'message' => 'Evento eliminado correctamente del carrito',
			'events' => $events,
			'deletedEvent' => $eventId,
		]);
	}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id){
		$user = User::findOrFail($id);

		$validated = $request->validate([
			'name' => 'sometimes|string|max:255',
			'image' => 'sometimes|string' 
		]);

		$user->update($validated);
		return response()->json($user);
		
	}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
		$user = User::find($id);
		if (!$user) {
			return response()->json(['message' => 'Usuario no encontrado'], 404);
		}
		$user->delete();
		return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}
