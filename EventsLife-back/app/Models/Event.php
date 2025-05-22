<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    //
	protected $fillable = [
		'name',
		'description',
		'location',
		'date',
		'start_date',
		'end_date',
		'organizer_id',
		'category_id',
		'price',
		'capacity',
		'image',
		'codes'
	];
	protected $casts = [
		'codes' => 'array',
	];

	public function organizer()
	{
		return $this->belongsTo(User::class, 'organizer_id');
	}
	public function category()
	{
		return $this->belongsTo(Category::class);
	}
}
