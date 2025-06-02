<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
		Category::create([
			'name' => 'Tasting',
			'key'=>'CATEGORY.TASTING'
		]);
		Category::create([
			'name' => 'Music',
			'key' => 'CATEGORY.MUSIC',
		]);
		
		Category::create([
			'name' => 'Food & Drink',
			'key' => 'CATEGORY.FOOD_DRINK',
		]);
		
		Category::create([
			'name' => 'Workshop',
			'key' => 'CATEGORY.WORKSHOP',
		]);
		
		Category::create([
			'name' => 'Networking',
			'key' => 'CATEGORY.NETWORKING',
		]);
		
		Category::create([
			'name' => 'Sports & Wellness',
			'key' => 'CATEGORY.SPORTS',
		]);
		
		Category::create([
			'name' => 'Education',
			'key' => 'CATEGORY.EDUCATION',
		]);
		
		Category::create([
			'name' => 'Art & Culture',
			'key' => 'CATEGORY.ART_CULTURE',
		]);
		
		Category::create([
			'name' => 'Family & Kids',
			'key' => 'CATEGORY.FAMILY',
		]);
		
		Category::create([
			'name' => 'Games & Competitions',
			'key' => 'CATEGORY.GAMES',
		]);
    }
}
