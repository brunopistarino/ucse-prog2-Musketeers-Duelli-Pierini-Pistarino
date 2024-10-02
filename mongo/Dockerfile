# Use the official MongoDB image
FROM mongo:latest

# Copy the initialization script into the container
COPY ./mongo-init.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017