# Test

This is a job test repository


# Backend

Configure and run laravel backend locally

## Configure and run application

 - Switch to laravel folder
	 

    ```bash
    cd laravel-api
    ```
   
 - Create .env file inside your root directory and copy .env.example to your .env file
 - Make sure your Database is connected
 - Generate application key
	 ```php
	 php artisan key:generate
	```
- Install dependencies
	```php
	composer install
	```
- Migrate and seed database
	```php
	php artisan migrate:fresh --seed
	```
- Run application
	```php
	php artisan serve
	```

# Frontend
Configure and run react frontend locally

## Configure and run application

- Switch to react folder
	```bash
	cd react-front-end
	```
- Install dependencies
	```javascript
	npm install
	```
- Run application
	```javascript
	npm run dev
	```
