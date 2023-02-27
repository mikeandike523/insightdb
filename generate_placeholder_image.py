import argparse

import numpy as np
import PIL.Image
import cv2
import PIL.ImageDraw
import PIL.ImageFont

SW = 20
SH = 20
C1 = (255,255,0)
C2 = (0,255,255)
TEXTCOLOR=(0,0,0)

parser = argparse.ArgumentParser()

parser.add_argument("--name", help="File Name")
parser.add_argument("--width", help="Width")
parser.add_argument("--height", help="Height")
parser.add_argument("--font-size", help="Font Size")

args = parser.parse_args()

n = args.name
w = int(args.width)
h = int(args.height)
font_size = int(args.font_size)

# A function to create a chessboard pattern in an image
def checkerboard(w, h, sw, sh=None):
    
    if sh is None:
        sh = sw
        
    mask = np.fromfunction(lambda R, C: ((np.floor(R/sh) + np.floor(C/sw)) % 2) == 0, (h, w), dtype=int)
    
    a = np.full((h,w,3), C1)
    b = np.full((h, w,3), C2)
    
    mask_image = np.where(np.dstack((mask,)*3), a, b).astype(np.uint8)
    
    blank = PIL.Image.fromarray(mask_image)
    
    i1 = PIL.ImageDraw.Draw(blank)

    i1.text((0,0), n, font=PIL.ImageFont.truetype("arial.ttf", font_size), fill=TEXTCOLOR)
    
    mask_image = np.asarray(blank)

    return mask_image

image = checkerboard(w, h, SW, SH)

PIL.Image.fromarray(image).save(f"public/{n}")



    


