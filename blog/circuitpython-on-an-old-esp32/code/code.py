# CircuitPython example: load an image the show it on an e-Ink display
def main():
    # Wrap everything in main() so locals are freed on return
    import time
    import board
    import displayio
    import fourwire
    import adafruit_ssd1681

    displayio.release_displays()

    spi = board.SPI()  # Uses SCK(D18) and MOSI(D23)
    epd_cs = board.D5
    epd_dc = board.D17
    epd_reset = board.D16
    epd_busy = board.D4

    display_bus = fourwire.FourWire(
        spi, command=epd_dc, chip_select=epd_cs, reset=epd_reset, baudrate=1000000
    )
    time.sleep(1)

    display = adafruit_ssd1681.SSD1681(
        display_bus, width=200, height=200, busy_pin=epd_busy, rotation=180
    )

    g = displayio.Group()

    pic = displayio.OnDiskBitmap("/mm.bmp")
    t = displayio.TileGrid(pic, pixel_shader=pic.pixel_shader)
    g.append(t)

    display.root_group = g

    display.refresh()


main()

