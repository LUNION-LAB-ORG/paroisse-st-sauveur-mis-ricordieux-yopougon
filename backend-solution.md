# Solution pour l'API Participants

## Problème
L'endpoint `/participants` est protégé par le middleware d'authentification mais les inscriptions aux événements devraient être publiques.

## Solution recommandée : Créer une route publique

### 1. Modifier le fichier routes/api.php

Ajoutez cette route pour les participants (sans authentification) :

```php
// Route publique pour les inscriptions aux événements
Route::post('/participants', [ParticipantController::class, 'store']);
Route::get('/participants/event/{eventId}', [ParticipantController::class, 'getByEvent']);
```

### 2. Créer le ParticipantController

```bash
php artisan make:controller ParticipantController
```

### 3. Implémenter le controller

```php
<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $participant = Participant::create($validated);

        return response()->json([
            'data' => $participant,
            'message' => 'Inscription réussie'
        ], 201);
    }

    public function getByEvent($eventId)
    {
        $participants = Participant::where('event_id', $eventId)->get();
        
        return response()->json([
            'data' => $participants,
            'message' => 'Participants récupérés'
        ]);
    }
}
```

### 4. Créer le Model Participant

```bash
php artisan make:model Participant -m
```

Dans la migration :
```php
Schema::create('participants', function (Blueprint $table) {
    $table->id();
    $table->string('fullname');
    $table->string('email');
    $table->string('phone');
    $table->text('message');
    $table->foreignId('event_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

### 5. Exécuter la migration

```bash
php artisan migrate
```

## Alternative rapide : Temporairement désactiver l'auth

Si vous voulez tester rapidement, vous pouvez temporairement commenter le middleware dans `app/Http/Kernel.php` :

```php
// 'auth' => \App\Http\Middleware\Authenticate::class,
```

⚠️ **Attention :** C'est temporaire et non sécurisé pour la production !
