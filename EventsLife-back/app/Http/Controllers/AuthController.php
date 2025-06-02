<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


//Servicio de Alice para validación del usuario organizador
use GuzzleHttp\Client;


class AuthController extends Controller
{
    //
	public function register(Request $request){

		Log::info('Inicio del proceso de registro', ['request' => $request->all()]);

		$validator = Validator::make($request->all(), [
			'name' => 'required|string|max:255',
			'email' => 'required|string|email|max:255|unique:users',
			'password' => 'required|string|min:6',
			'phone' => 'nullable|string|min:9',
			'address' => 'nullable|string|max:255',
			'role' => 'string|max:255',
		]);

		
		
		if ($validator->fails()) {
			$errors = $validator->errors();

			if ($errors->has('password')) {
				return response()->json([
					'errorCode' => 'PASSWORD_LENGTH',
					'message' => $errors->first('password')
				], 400);
			}
			
			return response()->json([
				'errorCode' => 'GENERICAL_ERROR',
				'errors' => $errors
			], 400);
		}

		$user = User::create([
			'name' => $request->name,
			'email' => $request->email,
			'password' => Hash::make($request->password),
			'phone' => $request->phone,
			'address' => $request->address,
			'email_verified_at' => now(),
			'remember_token' => Str::random(60),
			'role' => $request->role,
			'events_ids' => [],
			'history'=>[],
			'image'=>'',
		]);


		$token = $user->createToken('token')->plainTextToken;
		
    	return response()->json([
            'token' => $token,
            'user'  => $user
        ]);
	}

	public function login(Request $request){
		$validator = Validator::make($request->all(), [
			'email' => 'required|string|email|max:255',
			'password' => 'required|string|min:6',
		]);
		//Para sacar al usuario de la base de datos mediante el email, que es único para cada uno
		$user = User::where('email', $request->email)->first();
		
		//Si el email no se encuentra o la contraseña no coincide, se devuelve un error
		if (!$user || !Hash::check($request->password, $user->password)) {
        	return response()->json(['message' => 'Invalid credentials','errorCode'=>'LOGIN'], 400);
    	}
		//Creamos el token para el usuario
		$token = $user->createToken('token')->plainTextToken;

		return response()->json([
			'token' => $token,
			'user'  => $user
		]);
	}



	public function createEvent(Request $request){
		$validator = Validator::make($request->all(), [
			'title' => 'required|string|max:255',
			'description' => 'required|string|max:255',
			'date' => 'required|date',
			'location' => 'required|string|max:255',
			'capacity' => 'required|integer',
			'ticket_price' => 'required|numeric',
			'image_url' => 'nullable|string|max:255',
		]);

		if ($validator->fails()) {
			return response()->json($validator->errors(), 400);
		}

		// Aquí puedes crear el evento en la base de datos
		return response()->json(['message' => 'Evento creado exitosamente']);

	}

	

	public function user(Request $request){
		return response()->json($request->user());
	}
	
}
