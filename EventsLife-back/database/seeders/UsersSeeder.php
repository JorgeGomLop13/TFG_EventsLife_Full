<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;


class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
		User::factory()->create([
            'name' => 'standart',
            'email' => 'standart@standart.com',
			'password'=> 'standart',
			'role' => 'standart',
			'phone' => '',
			'address' => 'Calle Falsa 123',
			'events_ids'=>[],
			'history'=>[]
        ]);
		User::factory()->create([
            'name' => 'organizer',
            'email' => 'organizer@organizer.com',
			'password'=> 'organizer',
			'role' => 'organizer',
			'phone' => '555667788',
			'address' => 'Calle Falsa 456',
			'events_ids'=>[],
			'history'=>[]
        ]);
		User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
			'password'=> 'admin',
			'role' => 'admin',
			'phone' => '',
			'address' => 'Calle Falsa 789',
			'events_ids'=>[],
			'history'=>[]
        ]);
    }
}
