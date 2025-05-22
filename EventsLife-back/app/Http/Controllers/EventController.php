<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\App;


class EventController extends Controller
{
    
	public function index(Request $request): JsonResponse{
		$perPage = $request->query('limit', 6); 
    	$page = $request->query('page', 1);

    	$events = Event::paginate($perPage, ['*'], 'page', $page);

		return response()->json($events);
	}

	public function getById($id){
		$events = Event::where('id', $id)->get();
		return response()->json($events);

	}

	public function search(Request $request): JsonResponse{
		$perPage = $request->query('limit', 6); 
		$page = $request->query('page', 1);
		$search = $request->query('search');

		$query = Event::query();

		if ($search) {
			$query->where('name', 'like', '%' . $search . '%');
		}

		$events = $query->paginate($perPage, ['*'], 'page', $page);

		return response()->json($events);
	}

	public function getByOrganizer($organizerId){
		$events = Event::where('organizer_id', $organizerId)->get();
		return response()->json($events);
	}
	
	public function store(Request $request){
		$validated = $request->validate([
			'name' => 'required|string|max:255',
			'description' => 'required|string',
			'location' => 'required|string',
			'date' => 'required|date',
			'start_date' => 'required|date_format:H:i',
			'end_date' => 'required|date_format:H:i|after_or_equal:start_date',
			'organizer_id' => 'required|exists:users,id',
			'category_id' => 'required|exists:categories,id',
			'price' => 'required|numeric',
			'capacity' => 'required|integer',
			'image' => 'nullable|string',
		]);

		// Creo el evento
		$event = Event::create($validated);

		return response()->json($event, 201);
	}

	public function destroy($id){
		$event = Event::findOrFail($id);
		$event->delete();
		
    	return response()->json(['message' => 'Evento eliminado']);
	}

	public function update(Request $request, $id){
		$event = Event::find($id);
		if (!$event) {
			return response()->json(['message' => 'Event not found'], 404);
		}

		$validated = $request->validate([
			'name' => 'sometimes|required|string|max:255',
			'description' => 'sometimes|required|string',
			'location' => 'sometimes|required|string',
			'date' => 'sometimes|required|date',
			'start_date' => 'sometimes|required|date_format:H:i',
			'end_date' => 'sometimes|required|date_format:H:i|after_or_equal:start_date',
			'organizer_id' => 'sometimes|required|exists:users,id',
			'category_id' => 'sometimes|required|exists:categories,id',
			'price' => 'sometimes|required|numeric',
			'capacity' => 'sometimes|required|integer',
			'image' => 'nullable|string',
		]);

		$event->update($validated);
		return response()->json($event);
	}

	public function setCodeToEvent(Request $request){
		$event = Event::find($request->eventId);

		if (!$event) {
			return response()->json(['message' => 'Event not found'], 404);
		}

		$newCode = $request->code;

		$codes = $event->codes;
		$codes[] = $newCode;

		$event->codes = $codes;
		$event->save();

		return response()->json([
			'message' => 'Código añadido correctamente',
			'event' => $event,
			'code' => $newCode,
		]);
	}
	public function getCodesFromEvent(Request $request,$id){
		$language = $request->query('language', 'es');
		App::setLocale($language);

		$event = Event::find($id);

		if (!$event || empty($event->codes)) {
			return response()->json(['message' => 'Evento no encontrado o sin códigos'], 404);
		}
		//Hay que cargar la vista de pdf, le pasamos los códigos y en el pdf se muestran todos con un bucle
		$pdf = Pdf::loadView('pdf.codes', ['codes' => $event->codes]);
		return $pdf->download(__('messages.event_codes_title') . "{$id}.pdf");
	}
	
}
