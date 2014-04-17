import cv2
import urllib
import numpy as np
import glob
import sys
from PIL import Image


def getMatrixDims(URLS):
    rows = []
    cols = []
    dates = []
    for url in URLS:
        pieces = url.split('&')
        # Acess the date parameter
        dates.append(pieces[-1].split('=')[-1])
        # Access the TileRow parameter
        rows.append(int(pieces[-2].split('=')[-1]))
        # Access the TileRow parameter
        cols.append(int(pieces[-3].split('=')[-1]))
        # Access the zoom (TileMatrix) parameter
        zoom = pieces[-4].split('=')[-1]

    #print "Columns",cols
    #print "Rows",rows
    #print "Dates",dates

    url = '&'.join(pieces)
    url = url.split('%')
    url = '%%'.join(url)

    pieces = url.split('&')
    pieces[-1] = "TIME=%s"
    pieces[-2] = "TileRow=%i"
    pieces[-3] = "TileCol=%i"

    url = '&'.join(pieces)
    dims = [range(min(cols),max(cols)+1),range(min(rows),max(rows)+1),sorted(set(dates)),url]
    #print "Dimensions",dims

    return dims

def createImages(dims):
    h = 512
    w = 512

    reducedSizePerTile = 128

    first = True
    filename = 0
    #print dims[2]
    # Iterate by dates
    for k in dims[2]:
        # Creates an empty matrix that will hold each 'stiched' image
        vis = np.zeros((h*(len(dims[1])), w*len(dims[0]),3), np.uint8)

        # Iterate by columns
        for i in range(len(dims[0])):

            # Iterate by rows
            for j in range(len(dims[1])):
                currURL = dims[3] % (dims[0][i],dims[1][j],k)
                test = "TileCol=%i TileRow=%i TIME=%s" % (dims[0][i],dims[1][j],k)
                #print test
                # Reading the image here
                urllib.urlretrieve(currURL,'temp')
                img = cv2.imread('temp')
                vis[j*w:j*w+w,i*h:i*h+h,] = img

        visCompress = cv2.resize(vis, (reducedSizePerTile*len(dims[0]),reducedSizePerTile*len(dims[1])))
        cv2.imwrite("img/"+str(filename).rjust(5,'0')+".png", visCompress)
        filename+=1

    f = open('numImages.txt', 'w')
    f.write('%s' % str(filename).rjust(5,'0'))
    f.close()
    
def createAVI():
    h = 512
    w = 512
    #fourcc = cv2.cv.CV_FOURCC(*'DIVX')
    fourcc = cv2.cv.CV_FOURCC('M','J','P','G')
    #fourcc = cv2.cv.CV_FOURCC(*'X264')
    video = cv2.VideoWriter('video.avi',fourcc,1,(w,h))
    images = glob.glob('cloudfree/*.png')
    for image in images:
        img = cv2.imread(image)
        video.write(img)
    cv2.destroyAllWindows()
    video.release()
    
def removeCloudy(percent):
    cr=200  ### 180 for BW  400 or 500 or 600 for color
    images = glob.glob('img/*.png')
    for path in images:
        im=Image.open(path)
        BW=im.convert('L')
        HH=BW.histogram();
        per=float(sum(HH[cr:len(HH)]))/float(sum(HH[0:]))
        #print "Percentage of clouds",per
        if per*100 <= percent:
            pathParts = path.split('/')
            newPath =  pathParts[0] + '/cloudfree/' + pathParts[1]
            im.save(newPath)
    

if __name__ == "__main__":
    debug = True
    #print "Step 1"
    animateOutput = sys.argv[1]
    perAcc = sys.argv[2]
    #print "Step 2"
    URLS = animateOutput.split()
    #print "Step 3"
    dims = getMatrixDims(URLS)
    #print "Step 4"
    createImages(dims)
    #print "Step 5"
    removeCloudy(int(perAcc))
    #print "Step 6"
    createAVI()

