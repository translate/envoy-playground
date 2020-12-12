
import time

import pytest


def test_title(selenium):
    selenium.get("http://localhost:8000")
    assert "Envoy" in selenium.title


@pytest.mark.screenshots
def test_open_proxy_modal(playground):
    playground.snap('proxy.create.open')

    # open the proxy modal
    playground.web.find_elements_by_name('Proxies')[0].click()
    time.sleep(1)
    name_input = playground.web.find_elements_by_id('name')[0]
    assert (
        name_input.get_attribute('placeholder')
        == 'Enter proxy name')

    # add first 2 keys of name
    name_input.send_keys('pr')
    playground.snap('proxy.create.name')

    # add rest of name and open configuration
    name_input.send_keys('oxy0')
    select = playground.web.find_element_by_css_selector(
        '.tab-pane.active form select#example')
    select.find_element_by_css_selector(
        '[value="Service: Python (asyncio)"]').click()
    playground.snap('proxy.create.configuration', .3)

    # add a port
    playground.web.find_element_by_link_text('Ports').click()
    time.sleep(.3)
    playground.web.find_element_by_css_selector(
        '.tab-pane.active form button').click()
    playground.snap('proxy.create.ports', .3)

    # set logging
    playground.web.find_element_by_link_text('Logging').click()
    time.sleep(.3)
    select = playground.web.find_element_by_css_selector(
        '.tab-pane.active form select')
    select.find_element_by_css_selector('[value="trace"]').click()
    playground.snap('proxy.create.logging', .3)

    # open certs tab
    playground.web.find_element_by_link_text('Certificates').click()
    playground.snap('proxy.create.certificates', .3)

    # open binaries tab
    playground.web.find_element_by_link_text('Binaries').click()
    playground.snap('proxy.create.binaries', .3)

    # click to start
    playground.web.find_element_by_css_selector(
        '.modal-footer .btn.btn-primary').click()

    playground.snap('proxy.create.starting', .3)

    # wait for started
    playground.snap('proxy.create.started', 60)
