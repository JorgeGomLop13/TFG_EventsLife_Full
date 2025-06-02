<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;


class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
		Event::create([
			'name' => 'Test Event',
			'description' => 'This is a test event',
			'location' => 'Test Location',
			'date' => '2025-01-01',
			'start_date' => '10:00:00',
			'end_date' => '12:00:00',
			'organizer_id' => 2,
			'category_id' => 1,
			'price' => 10,
			'capacity' => 100,
			'image' => 'test.jpg',
			'codes'=>[]
		]);
    }
}
