<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Resend\Laravel\Facades\Resend;

class OrderShipmentController extends Controller
{
    /**
     * Ship the given order.
     */
    public function store(Request $request): JsonResponse{

		Resend::emails()->send([
			'from' => 'Acme <onboarding@resend.dev>',
			'to' => [$request->email], 
			'subject' => $request->subject,
			'html' => $request->html,
		]);

		return response()->json(['message' => 'Email enviado con éxito']);

	}
}