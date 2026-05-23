# set a custom mDNS and hostname (set in settings.toml as HOSTNAME)
import os

name = os.getenv("HOSTNAME")
if name:
    import wifi
    import mdns
    mdns_server = mdns.Server(wifi.radio)
    mdns_server.hostname = name
    wifi.radio.hostname = name

