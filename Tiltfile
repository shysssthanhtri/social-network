# -*- mode: Python -*-

# Enforce a minimum Tilt version, so labels are supported
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.1')

docker_compose('docker/docker-compose.yml')

# Add labels to Docker services
dc_resource('postgresql', labels=["database"])
dc_resource('rabbitmq', labels=["rabbitmq"])
