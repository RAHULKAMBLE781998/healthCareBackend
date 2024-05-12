how to run - 
1. create .env and paste content from .env.example to .env
2. run - docker-compose up 
3. npm start
4. load healthCare.postman_collection.json to your postman


Features - 
1. Refresh token Invalidation
2. Unique Appointment index making sure no doctor-patient appointment is overlapping [@Unique(['doctor', 'dateTime', 'patient'])] 
3. TypeORM
4. AsyncLocalStorage
5. RateLimiting 
