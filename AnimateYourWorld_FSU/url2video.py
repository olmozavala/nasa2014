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
        zoom = pieces[-4].split('=')[-1]
        cols.append(int(pieces[-3].split('=')[-1]))
        rows.append(int(pieces[-2].split('=')[-1]))
        #date = pieces[-1].split('=')[-1]
        dates.append(pieces[-1].split('=')[-1])
        #sat = pieces[0].split('=')[-1]
        #nmax = pieces[3].split('=')[-1]
        #imgf = pieces[7].split('=')[-1]
        #wei = pieces[9].split('=')[-1]
        #print imgf
        #print pieces[0]
        #print sat
        #dates.extend(datetime.strptime(date, '%y-%m-%d'))
        #print nmax
        #print wei

    #print cols
    #print rows
    #url = '&'.join(pieces)
    url = url.split('%')
    url = '%%'.join(url)

    pieces = url.split('&')
    pieces[-1] = "TIME=%s"
    pieces[-2] = "TileRow=%i"
    pieces[-3] = "TileCol=%i"


    #print "sopas"

    url = '&'.join(pieces)
    dims = [range(min(cols),max(cols)+1),range(min(rows),max(rows)+1),sorted(set(dates)),url]
    #print "here"
    #print int(min(cols))
    #print range(int(min(cols)),int(max(cols))+1)
    #dims = [[int(min(cols)),int(max(cols))],[int(min(rows)),int(max(rows))],int(zoom),sorted(set(dates)),wei,imgf,sat,nmax]
    return dims

def createImages(dims):
    h = 512
    w = 512
    first = True
    filename = 0
    for k in dims[2]:
        #print "---- 1"
        #print len(dims[1])
        #print dims[0]
        #print dims[1]
        vis = np.zeros((h*(len(dims[1])), w*len(dims[0]),3), np.uint8)
        for i in range(len(dims[0])):
            #print "---- 2"
            #print range(dims[1][0],(dims[1][1]))
            for j in range(len(dims[1])):
                #print "Here: "+dims[-2]
                #currURL = """http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=%s&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%%2Fjpeg&TileMatrix=%i&TileCol=%i&TileRow=%i&TIME=%s""" % (dims[-1],dims[2],i,j,k)
                #currURL = """http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=%s&style&Style&TileMatrixSet=%s&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%%2Fjpeg&TileMatrix=%i&TileCol=%i&TileRow=%i&TIME=%s""" % (dims[-2],dims[-1],dims[2],i,j,k)
                #currURL = """http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=%s&style&Style&TileMatrixSet=%s&Service=WMTS&Request=GetTile&Version=1.0.0&Format=%s&TileMatrix=%i&TileCol=%i&TileRow=%i&TIME=%s""" % (dims[-2],dims[-1],dims[-3],dims[2],i,j,k)
                #print k
                #print type(i)
                #print type(j)
                #print type(k)
                #print type(dims[3])
                #print dims[3]
                #print dims[0]
                #print dims[1]
                print "sopas"
                currURL = dims[3] % (dims[0][i],dims[1][j],k)
                print currURL
                #urllib.urlretrieve(currURL,'temp.jpg')
                #img = cv2.imread('temp.jpg')
                urllib.urlretrieve(currURL,'temp')
                img = cv2.imread('temp')
                vis[j*w:j*w+w,i*h:i*h+h,] = img

        visCompress = cv2.resize(vis, (w,h))
        cv2.imwrite("img/"+str(filename).rjust(5,'0')+".png", visCompress)
        filename+=1

    #print "---- 4"
    f = open('numImages.txt', 'w')
    f.write('%s' % str(filename).rjust(5,'0'))
    f.close()
    
def createAVI():
    h = 512
    w = 512
    fourcc = cv2.cv.CV_FOURCC(*'DIVX')
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
        if per*100 <= percent:
            pathParts = path.split('/')
            #print pathParts
            newPath =  pathParts[0] + '/cloudfree/' + pathParts[1]
            im.save(newPath)
    

if __name__ == "__main__":
    #print "Step 1"
    animateOutput = sys.argv[1]
    perAcc = sys.argv[2]
    #print perAcc
    #print "Step 2"
    URLS = animateOutput.split()
    #print URLS
    #print "Step 3"
    dims = getMatrixDims(URLS)
    #print "Step 4 new"
    createImages(dims)
    #print "Step 5"
    #removeCloudy(int(perAcc))
    removeCloudy(int(perAcc))
    #print "Step 6"
    createAVI()

