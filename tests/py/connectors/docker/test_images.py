
from unittest.mock import AsyncMock, MagicMock

import pytest

import aiodocker

from playground.control.connectors.docker import client, images


class DummyPlaygroundClient(client.PlaygroundDockerClient):

    def __init__(self):
        self.docker = MagicMock()


def test_docker_images():
    connector = DummyPlaygroundClient()
    _images = images.PlaygroundDockerImages(connector)
    assert _images.connector == connector
    assert _images.docker == connector.docker


@pytest.mark.parametrize("force", [True, False])
@pytest.mark.parametrize("exists", [True, False])
@pytest.mark.parametrize("raises", [True, False])
@pytest.mark.asyncio
async def test_docker_images_pull(patch_playground, force, exists, raises):
    connector = DummyPlaygroundClient()
    _images = images.PlaygroundDockerImages(connector)

    _patch_tag = patch_playground(
        'connectors.docker.images.PlaygroundDockerImages._image_tag')
    _patch_exists = patch_playground(
        'connectors.docker.images.PlaygroundDockerImages.exists',
        new_callable=AsyncMock)
    _patch_logger = patch_playground(
        'connectors.docker.images.logger')
    if raises:
        _images.docker.images.pull = AsyncMock(
            side_effect=aiodocker.DockerError(
                'STATUS', dict(message='MESSAGE')))
    else:
        _images.docker.images.pull = AsyncMock()

    with _patch_tag as m_tag:
        with _patch_exists as m_exists:
            with _patch_logger as m_logger:
                m_exists.return_value = exists
                response = await _images.pull('IMAGE', force=force)

                assert (
                    list(m_tag.call_args)
                    == [('IMAGE',), {}])

                if force:
                    assert not m_exists.called
                else:
                    assert (
                        list(m_exists.call_args)
                        == [(m_tag.return_value,), {}])
                if not force and exists:
                    assert not m_logger.info.called
                    assert not m_logger.error.called
                    assert not _images.docker.images.pull.called
                    assert response
                    return
                assert (
                    list(m_logger.info.call_args)
                    == [(f"Pulling image {m_tag.return_value}",), {}])
                assert (
                    list(_images.docker.images.pull.call_args)
                    == [(m_tag.return_value,), {}])
                if raises:
                    assert not response
                    assert (
                        list(m_logger.error.call_args)
                        == [(f"Failed pulling image: {m_tag.return_value} "
                             "DockerError(STATUS, 'MESSAGE')",), {}])
                else:
                    assert response
                    assert not m_logger.error.called
