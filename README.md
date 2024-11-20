
# Proyecto 8 : API REST FILES de bandas rock 

<div align="center">
<img src="https://res.cloudinary.com/dn6utw1rl/image/upload/v1732077953/samples/Captura_desde_2024-11-20_05-45-12_c0n67z.png" alt="Cloudinary-logo" width="450" />
</div>



API para la gestión de bandas de rock, que permite realizar operaciones CRUD con las bandas, sus líderes y estilos especificos.
Además permite la subida de imágenes a **Cloudinary** para añadirlas a los perfiles de bandas y líderes. 

### Tecnologías utilizadas

- **Node.js** con **Express**.
- **Mongoose** para modelado de datos en MongoDB.
- **Cloudinary** para almacenamiento de imágenes.
- **multer** para manejar las subidas de archivos.

### Requisitos previos **Cloudinary** <img src="https://res.cloudinary.com/dn6utw1rl/image/upload/v1704214012/samples/cloudinary-icon.png" alt="Cloudinary-logo" width="30" />


- Configurar una cuenta en **Cloudinary** y obtener las credenciales necesarias:

   - `CLOUD_NAME`
   - `API_KEY`
   - `API_SECRET`
  
- Configurar las variables de entorno en un archivo `.env`:
  
   ```env
   CLOUDINARY_CLOUD_NAME = tu_cloud_name
   CLOUDINARY_API_KEY = tu_api_key
   CLOUDINARY_API_SECRET = tu_api_secret

   ```

## Endpoints Rock Bands 🎸🎶

> GET /api/v1/bands/

- **Descripción:** Obtiene la lista de todas las bandas.

- **Respuesta:**

```json
[
	{
		"_id": "673d6b4f707e591268d1c53c",
		"name": "Led Zeppelin",
		"leadersId": [
			{
				"_id": "673d6b4f707e591268d1c528",
				"name": "Robert Plant"
			}
		],
		"styleId": {
			"_id": "673d6b4f707e591268d1c533",
			"name": "Hard Rock",
			"description": "Un estilo agresivo con un fuerte énfasis en guitarras distorsionadas y ritmo enérgico."
		},
		"isVerified": false,
		"__v": 0,
		"createdAt": "2024-11-20T04:53:35.737Z",
		"updatedAt": "2024-11-20T04:53:35.737Z"
	},
	{
		"_id": "673d6b4f707e591268d1c53d",
		"name": "The Beatles",
		"leadersId": [
			{
				"_id": "673d6b4f707e591268d1c529",
				"name": "John Lennon"
			}
		],
		"styleId": {
			"_id": "673d6b4f707e591268d1c534",
			"name": "Rock Pop",
			"description": "Rock con influencias de música pop, caracterizado por melodías pegajosas y estructuras de canción claras."
		},
		"isVerified": false,
		"__v": 0,
		"createdAt": "2024-11-20T04:53:35.737Z",
		"updatedAt": "2024-11-20T04:53:35.737Z"
	}
]

```

> GET /api/v1/bands/id/:id

- **Descripción:** Busca una banda por su id
  
- **Parámetros:**
  
  - `:id` = `_id` de la banda
  
- **Respuesta:**
  
```json
{
	"_id": "67243f638aa11d607a21b8b8",
	"name": "The Beatles",
	"leaderId": {
		"_id": "67243f638aa11d607a21b8a4",
		"name": "John Lennon"
	},
	"styleId": {
		"_id": "67243f638aa11d607a21b8af",
		"name": "Rock Pop",
		"description": "Rock con influencias de música pop, caracterizado por melodías pegajosas y estructuras de canción claras."
	},
	"isVerified": false,
	"__v": 0,
	"createdAt": "2024-11-01T02:39:31.791Z",
	"updatedAt": "2024-11-01T02:39:31.791Z"
}

```

> GET /api/v1/bands/verified/

- **Descripción:** Busca las bandas verificadas
  
- **Respuesta:**
  
```json
[
	{
		"_id": "6733da538c1a6e2d3d233b09",
		"name": "Led Zeppelin",
		"leadersId": [
			"6733da528c1a6e2d3d233af3",
			"6733da528c1a6e2d3d233af4",
			"6733dc57342931e044b6cf30"
		],
		"styleId": "6733da538c1a6e2d3d233aff",
		"isVerified": true,
		"__v": 0,
		"createdAt": "2024-11-12T22:44:35.083Z",
		"updatedAt": "2024-11-12T23:55:05.580Z"
	}
]

```

> POST /api/v1/bands/

- **Descripción:** Crea una nueva banda, permitiendo especificar líderes por nombre o ID, estilos por nombre o ID, y subiendo una imagen desde un dispositivo local a Cloudinary.
  
- **Cuerpo de la solicitud:** 
  
  **JSON**
  
    Si no necesitas añadir una imagen, puedes enviar los datos en formato JSON. 
    Al menos un líder y el estilo son requeridos, a demas del nombre de la banda.
    Si se envia un nombre de líder o de estilo que no existe aún, sera creado.

```json
{
   "name": "Aerosmith",
   "leadersId": ["5fdd1e8e6b86542d10c537fd", "5fdd1e8e6b86542d10c537fe"],
   "styleName": "Rock clásico"
}

```

  **Multipart/Form-Data**

  Para incluir una imagen, utiliza multipart/form-data:

| Campo       | Value           | Requerido | Descripción                                                      |
| ----------- | --------------- | --------- | ---------------------------------------------------------------- |
| `name`      | `string`        | Si        | Nombre de la banda.                                              |
| `leadersId` | `array[string]` | Si        | IDs de los líderes asociados (opcional si envías `leaderNames`). |
| `styleId`   | `string`        | si        | ID del estilo de la banda (opcional si envías `styleName`).      |
| `image`     | `file`          | No        | Imagen de la banda.                                              |


- **Respuesta:**
  
```json
{
	"message": "Banda añadida",
	"populatedBand": {
		"_id": "673a57ed002de29b84c41986",
		"name": "Aerosmith",
		"image": "https://res.cloudinary.com/dn6utw1rl/image/upload/v1731876842/grupos-Rock/ybf2rjskp68glslknijg.svg",
		"leadersId": [
			{
				"_id": "5fdd1e8e6b86542d10c537fd",
				"name": "Esteven Tyler"
			},
			{
				"_id": "5fdd1e8e6b86542d10c537fe",
				"name": "Joe Perry"
			}
		],
		"styleId": {
			"_id": "67367c92c5c618f8cab46560",
			"name": "Rock clásico"
		},
		"isVerified": false,
		"createdAt": "2024-11-17T20:54:05.849Z",
		"updatedAt": "2024-11-17T20:54:05.849Z",
		"__v": 0
	}
}

```

> PUT /api/v1/bands/:id

- **Descripción:** Actualiza los datos de una banda, al actualizar la imagen, se eliminara la antigua imagen de Cloudinary ya que no se estara utilizando.    
  
- **Parámetros:**
  
  - `:id` = `_id` de la banda
  
- **Cuerpo de la solicitud:**
  
  **JSON**
  
    Si no necesitas añadir una imagen, puedes enviar los datos en formato JSON. 
    Si se envia un nombre de líder o de estilo que no existe aún, sera creado.
  
```json
{
  
   "leadersId": ["67369d4f342931e0440e9baa"],
   "isVerified": "true"

}

```

  **Multipart/Form-Data**

   Para incluir una imagen, utiliza multipart/form-data:

| Campo       | Value           | Requerido | Descripción                                                      |
| ----------- | --------------- | --------- | ---------------------------------------------------------------- |
| `name`      | `string`        | Si        | Nombre de la banda.                                              |
| `leadersId` | `array[string]` | Si        | IDs de los líderes asociados (opcional si envías `leaderNames`). |
| `styleId`   | `string`        | si        | ID del estilo de la banda (opcional si envías `styleName`).      |
| `image`     | `file`          | No        | Imagen de la banda.                                              |


- **Respuesta:**
  
```json
{
	"message": "Banda actualizada",
	"populatedBand": {
		"_id": "673a57ed002de29b84c41986",
		"name": "Aerosmith",
		"image": "https://res.cloudinary.com/dn6utw1rl/image/upload/v1731876842/grupos-Rock/ybf2rjskp68glslknijg.svg",
		"leadersId": [
			{
				"_id": "5fdd1e8e6b86542d10c537fd",
				"name": "Esteven Tyler"
			},
			{
				"_id": "5fdd1e8e6b86542d10c537fe",
				"name": "Joe Perry"
			},
			{
				"_id": "67369d4f342931e0440e9baa",
				"name": "Joey Kramer"
			}
		],
		"styleId": {
			"_id": "67367c92c5c618f8cab46560",
			"name": "Rock clásico"
		},
		"isVerified": true,
		"createdAt": "2024-11-17T20:54:05.849Z",
		"updatedAt": "2024-11-17T20:54:05.849Z",
		"__v": 0
	}
}

```

> DELETE /api/v1/bands/:id
 
- **Descripción:** Elimina una banda y la imagen de su perfil en Cloudinary si la hubiese, asi como todas las referencias en el estilo y lideres a la banda.
  
- **Parámetros:**
  
  - `:id` = `_id` del vehiculo
  
- **Respuesta:**
  
```json
{
	"message": "Banda eliminada correctamente",
	"band": {
		"_id": "673679c2c21b7966086c7eb7",
		"name": "Metallica",
		"leadersId": [
			"673679c2c21b7966086c7ea1"
		],
		"styleId": "673679c2c21b7966086c7eae",
		"isVerified": false,
		"__v": 0,
		"createdAt": "2024-11-14T22:29:22.721Z",
		"updatedAt": "2024-11-17T20:59:47.747Z",
		"image": "https://res.cloudinary.com/dn6utw1rl/image/upload/v1731877187/grupos-Rock/lofhgxibxzy6hqqdmlir.png"
	}
}
```

## Endpoints Rock Bands Leaders 👩‍🎤👨‍🎤