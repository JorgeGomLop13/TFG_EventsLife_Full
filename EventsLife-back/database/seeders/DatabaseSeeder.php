<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
			UsersSeeder::class
			, CategorySeeder::class
			, EventSeeder::class
		]);
		//php artisan db:seed para llamar a este seeder
    }
}
