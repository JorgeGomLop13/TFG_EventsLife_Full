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
            'name' => 'Pepe Barroso',
            'email' => 'pepe@gmail.com',
			'password'=> 'pepebarroso',
			'role' => 'standart',
			'phone' => '',
			'address' => 'Calle Falsa 123',
			'events_ids'=>[],
			'history'=>[],
			'image'=>''
        ]);
		User::factory()->create([
            'name' => 'Cafetería Molona',
            'email' => 'cafeteriaMolona@gmail.com',
			'password'=> 'molona',
			'role' => 'organizer',
			'phone' => '555667788',
			'address' => 'Calle Colombia 34',
			'events_ids'=>[],
			'history'=>[],
			'image'=>''
        ]);
		User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
			'password'=> 'admin',
			'role' => 'admin',
			'phone' => '',
			'address' => 'Calle Falsa 789',
			'events_ids'=>[],
			'history'=>[],
			'image'=>''
        ]);
    }
}
