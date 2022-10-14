import time, uuid, json
import random
from locust import HttpUser, TaskSet, task, between

class AuthenticatedUser(HttpUser):
    wait_time = between(1, 2.5)
    host = 'http://172.17.0.1:5000'

    @task
    def sample_task(self):
        response = self.client.get('/', catch_response=True)
        print(response.text)
        print(response.content)
        print(response.status_code)