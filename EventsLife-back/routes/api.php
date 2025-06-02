<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderShipmentController;



Route::get('/users',[UserController::class, 'index']);
Route::get('/userId/{id}',[UserController::class, 'getById']);
Route::delete('/user/{id}',[UserController::class, 'destroy']);
Route::get('/event/{eventId}/user/{userId}',[UserController::class,'addEventToCart']);
Route::get('/profile/{userId}/event/{eventId}',[UserController::class,'deleteFromCart']);
Route::post('/createAccountStripe',[UserController::class, 'createAccountLink']);
Route::post('/payProduct',[UserController::class, 'createCheckoutSession']);
Route::post('/setStripeId',[UserController::class, 'setStripeAccount']);
Route::post('/setEventToHistory ',[UserController::class, 'setEventToHistory']);
Route::get('/history/{userId}',[UserController::class, 'getHistoryEventsByUser']);
Route::get('/eventsFromIds/{eventId}',[UserController::class,'getCart']);
Route::delete('/user/{userId}/events/{eventId}',[UserController::class,'deleteFromCart']);
Route::put('/user/{id}/update',[UserController::class,'update']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

Route::get('/categories',[CategoryController::class, 'index']);

Route::post('/event',[EventController::class, 'store']);
Route::get('/event/organizer/{id}', [EventController::class, 'getByOrganizer']);
Route::delete('/event/{id}', [EventController::class, 'destroy']);
Route::get('/events',[EventController::class,'index']);
Route::get('/eventsSearch',[EventController::class,'search']);
Route::get('/event/id/{id}',[EventController::class,'getById']);
Route::put('/event/{id}/update', [EventController::class, 'update']);
Route::post('/setCodeToEvent',[EventController::class,'setCodeToEvent']);
Route::get('/event/{id}/codes',[EventController::class,'getCodesFromEvent']);


Route::post('/sendEmail', [OrderShipmentController::class, 'store']);
