# CarsHub
CarsHub is a web application developed to offer a comprehensive platform for car enthusiasts. Built using the MEVN stack (MongoDB, ExpressJS, Vue, and NodeJS), the application follows a Model-View-Controller (MVC) architecture and operates as a Single Page Application (SPA). It leverages modern development tools like Docker, JWT, and Mongoose to ensure a secure and efficient experience.

Our team adopted agile methodologies, working in weekly sprints and utilizing tools like Jira for task management. We implemented continuous integration through GitHub Actions, conducted rigorous testing using Supertest, Mocha, and Chai, and focused on code quality with SonarCube Cloud and coverage with Coveralls.



## **Authors**

- **David Tolosa**  
  [GitHub Profile](https://github.com/ElChancho)

- **David Hernández**  
  [GitHub Profile](https://github.com/ElChancho)

- **Néstor Delgado Feliciano**  
  [GitHub Profile](https://github.com/Nestor-DF)



## **How to Use the Scripts**

### **1. `clean_all.sh`**
This script is designed to completely clean your Docker environment, including stopping all containers, removing them, deleting all images, and cleaning unused volumes and resources.

**Steps to Execute:**
1. Give execution permissions to the script (if not already set):
   ```bash
   chmod +x clean_all.sh
   ```
2. Run the script:
   ```bash
   ./clean_all.sh
   ```

**⚠️ Warning:**
- Executing this script will **completely remove all Docker containers, images, and volumes** from your system.
- Ensure you have backed up any important data before running this script.
- Use with caution, as it cannot be undone.

---

### **2. `reset.sh`**
This script is intended to reset a specific Docker Compose environment by bringing down all services, removing associated volumes, and rebuilding the services.

**Steps to Execute:**
1. Give execution permissions to the script (if not already set):
   ```bash
   chmod +x reset.sh
   ```
2. Run the script:
   ```bash
   ./reset.sh
   ```

**⚠️ Warning:**
- This script will remove the Docker Compose environment's volumes, leading to the loss of any data stored within those volumes.
- Make sure to confirm that no critical data is stored before executing.


## Run Tests
```
docker exec -it CarsHub_backend_container npm test
```


## Public Routes Documentation

### **1. Cars**

#### Filter Cars
**URL:**
```
POST localhost:5000/api/cars/filter
```
**Available Fields:**
```json
{
    "brands": [
        "Abarth",
        "Alfa Romeo",
        "Apollo",
        "Aston Martin",
        "Audi",
        "Bentley",
        "BMW",
        "Bugatti",
        "Cadillac",
        "Chevrolet",
        "Citroen",
        "Cupra",
        "De Tomaso",
        "Dodge",
        "Ferrari",
        "Fiat",
        "Ford",
        "Honda",
        "Hyundai",
        "Jaguar",
        "Jeep",
        "Kia",
        "Koenigsegg",
        "Lamborghini",
        "Land Rover",
        "Lexus",
        "Lotus",
        "Maserati",
        "Mazda",
        "McLaren",
        "Mercedes-Benz",
        "Mitsubishi",
        "Nissan",
        "Opel",
        "Pagani",
        "Peugeot",
        "Pontiac",
        "Porsche",
        "Renault",
        "Rolls-Royce",
        "Seat",
        "Smart",
        "Subaru",
        "Suzuki",
        "Tesla",
        "Toyota",
        "Volkswagen"
    ],
    "countries": [
        "Germany",
        "South Korea",
        "Spain",
        "United States",
        "France",
        "Italy",
        "Japan",
        "United Kingdom",
        "Sweden"
    ],
    "fuelTypes": [
        "Diesel",
        "Electric",
        "Gasoline",
        "Gasoline and Diesel",
        "Hybrid"
    ],
    "tractionTypes": [
        "Front-wheel drive",
        "All-wheel drive",
        "Four-wheel drive",
        "Rear-wheel drive"
    ],
    "price": {
        "min": 825,
        "max": 18000000
    },
    "speed": {
        "min": 120,
        "max": 180
    },
    "manufactureYear": {
        "min": 1907,
        "max": 2024
    },
    "string_clave": "miau" // Searches in brand/model/description using a regex
}
```
---

#### Get Random Cars
**URL:**
```
GET localhost:5000/api/cars/random
```
**Sample Query:**
```
GET localhost:5000/api/cars/random?limit=3
```
---

#### Get All Possible Fields for Filtering
**URL:**
```
GET localhost:5000/api/cars/metadata
```
---

#### Get Car by ID
**URL:**
```
GET localhost:5000/api/cars/:id
```
---

### **2. Car Lists**

#### Public Lists
**URL:**
```
GET localhost:5000/api/carList/public
```
---

#### Top-Rated Lists
**URL:**
```
GET localhost:5000/api/carList/top-rated
```
---

#### Most Commented Lists
**URL:**
```
GET localhost:5000/api/carList/most-commented
```
---

#### Latest Created Lists
**URL:**
```
GET localhost:5000/api/carList/latest
```
---

#### Random Lists
**URL:**
```
GET localhost:5000/api/carList/random
```
---

#### Add Comment to a List
**URL:**
```
POST localhost:5000/api/carList/:id/comment
```
**Sample Body:**
```json
{
  "comment": "This list is great!"
}
```
---

### **3. Images**

#### Get All Images
**URL:**
```
GET localhost:5000/api/avatar
```

#### Get Image by ID
**URL:**
```
GET localhost:5000/api/avatar/:id
```

### **4. Users**

#### User Registration
**URL:**
```
POST localhost:5000/api/user/signup
```
**Sample Body:**
```json
{
  "username": "newUser",
  "password": "password123",
  "email": "user@example.com"
}
```
---

#### User Login
**URL:**
```
POST localhost:5000/api/user/signin
```
**Sample Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
---

#### Get Personal User Information
**URL:**
```
GET localhost:5000/api/user/me
```
---

#### Like a List
**URL:**
```
PATCH localhost:5000/api/user/likelist
```
**Sample Body:**
```json
{
  "listId": "id"
}
```
---

#### Dislike a List
**URL:**
```
PATCH localhost:5000/api/user/dislikelist
```
**Sample Body:**
```json
{
  "listId": "id"
}
```
---

#### Check if a List is Liked
**URL:**
```
POST localhost:5000/api/user/islistliked
```
**Sample Body:**
```json
{
  "listId": "id"
}
```
---

#### Follow a User
**URL:**
```
POST localhost:5000/api/users/follow
```
**Sample Body:**
```json
{
  "userIdToFollow": "userId"
}
```
**Description:**
Allows the authenticated user to follow another user.

---

#### Unfollow a User
**URL:**
```
POST localhost:5000/api/users/unfollow
```
**Sample Body:**
```json
{
  "userIdToUnfollow": "userId"
}
```
**Description:**
Allows the authenticated user to unfollow another user.

---

#### Get a User's Followers
**URL:**
```
GET localhost:5000/api/users/:id/followers
```
**Parameters:**
- `:id` - The ID of the user whose followers you want to retrieve.

**Description:**
Returns a list of users following the specified user.

---

#### Get a User's Following List
**URL:**
```
GET localhost:5000/api/users/:id/following
```
**Parameters:**
- `:id` - The ID of the user whose following list you want to retrieve.

**Description:**
Returns a list of users the specified user is following.

