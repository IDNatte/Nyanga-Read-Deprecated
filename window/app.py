import webview
import os

from utils.get_resources import resource_path
from api.api import Api

ENV = os.environ.get("APP_DEV", default=None)


def is_dev():
    if ENV:
        return "http://localhost:5173"

    if not ENV:
        return resource_path("layout/index.html")


renderer = is_dev()
api = Api()

if __name__ == "__main__":
    webview.create_window(
        "Nyanga Read",
        renderer,
        js_api=api,
        width=1280,
        height=700,
        min_size=(1280, 700),
    )

    if ENV:
        webview.start(private_mode=False, debug=True)

    if not ENV:
        webview.start(private_mode=False)
