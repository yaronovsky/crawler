**Since I am using an M1 Mac I had to use arm packages for Puppeteer**

To launch this project you have to navigate to:

```bash 
cd node-backend && npm i
```

```bash 
cd react-frontend && npm i
```

Then you can run the following commands:

```bash
docker compose up --build
```

Frontend will be available at [http://localhost:3001](http://localhost:3001) and backend
at [http://localhost:3000](http://localhost:3000)

Keep in mind this is a highly MVP project
Many practices here are pure for the project:
Such as:
* Flat Redis key system
* CORS enabled for all origins
* Project Structure

