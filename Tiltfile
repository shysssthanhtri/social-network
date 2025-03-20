# -*- mode: Python -*-

# Enforce a minimum Tilt version, so labels are supported
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.1')

docker_compose('docker/docker-compose.yml')

# Add labels to Docker services
dc_resource('postgresql', labels=["database"])
dc_resource('rabbitmq', labels=["rabbitmq"])
dc_resource('authentication-service', labels=["authentication-service"])

docker_build(
    'authentication-service', 
    '.',
    dockerfile='./apps/authentication-service/docker/Dockerfile',
    target='developing',
    live_update = [
        sync('./apps/authentication-service/src', '/app/apps/authentication-service/src'),
    ]
)
