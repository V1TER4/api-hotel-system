## Hotel System API

This API is used to manage a hotel system.

### Project Installation

Follow the commands below to install and run the project:

```bash
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
```

### Endpoints

#### List all hotels

```http
GET /hotels/all
```

#### Get hotel by ID

```http
GET /hotels/:id
```

#### Create a new hotel

```http
POST /hotels/create
```

#### Update a hotel

```http
PUT /hotels/:id
```

### Request Structure

#### List Users

```json
{
    "filters": {
        "name": "Admin",
        "email": "admin@admin.com",
        "user_type_id": "1",
        "status_id": "1"
    }
}
```

#### List Hotels

```json
{
    "filters": {
        "name": "Hotel Beira Mar",
        "city_id": 3479
    }
}
```

#### Create/Update Hotel

```json
{
    "name": "Hotel Beira Mar",
    "email": "hotel@beiramar.com",
    "document": "93079804000109",
    "status_id": 1,
    "telephone": "11973654879",
    "address": {
        "street": "Rua Doutor Gervásio Bonavides",
        "number": 567,
        "district": "Vila Luis Antônio",
        "city_id": 3479,
        "state_id": 18,
        "country_id": 1,
        "postal_code": "11420210"
    },
    "rooms": {
        "1": {
            "room_number": "01",
            "capacity": 6,
            "price": 150.0,
            "description": "Apartamento no centro"
        },
        "2": {
            "room_number": "02",
            "capacity": 6,
            "price": 150.0,
            "description": "Apartamento no centro"
        }
    }
}
```

### Authentication

Authentication is done through a token. Add the token in the request headers:

```http
Authorization: Bearer <token>
```

### Common Errors

- `401 Unauthorized`: Invalid or missing token.
- `404 Not Found`: Hotel not found.
- `500 Internal Server Error`: Internal server error.

### Contribution

To contribute to this project, fork the repository, create a branch for your changes, and submit a pull request.

### License

This project is licensed under the MIT license.