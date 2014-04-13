import cv2
import urllib
import numpy as np
import glob
import sys 

def getMatrixDims(URLS):
	rows = []
	cols = []
	dates = []
	for url in URLS:
		pieces = url.split('&')
		zoom = pieces[-4].split('=')[-1]
		cols.extend(pieces[-3].split('=')[-1])
		rows.extend(pieces[-2].split('=')[-1])
		#date = pieces[-1].split('=')[-1]
		dates.append(pieces[-1].split('=')[-1])
		#dates.extend(datetime.strptime(date, '%y-%m-%d'))
	dims = [[int(min(cols)),int(max(cols))],[int(min(rows)),int(max(rows))],int(zoom),sorted(set(dates))]
	return dims

def createImages(dims):
	h = 512
	w = 512
	first = True
	filename = 0
	for k in dims[3]:
		vis = np.zeros((h*dims[1][1]-dims[1][0], w*dims[0][1]-dims[0][0],3), np.uint8)
		for i in range(dims[0][0],dims[0][1]):
			for j in range(dims[1][0],dims[1][1]):
				currURL = """http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%%2Fjpeg&TileMatrix=%i&TileCol=%i&TileRow=%i&TIME=%s""" % (dims[2],i,j,k)
				urllib.urlretrieve(currURL,'temp.jpg')
				img = cv2.imread('temp.jpg')
				vis[j*w:j*w+w,i*h:i*h+h,] = img
		visCompress = cv2.resize(vis, (w,h))
		cv2.imwrite("images/"+str(filename).rjust(5,'0')+".png", visCompress)
		filename+=1
	f = open('numImages.txt', 'w')
	f.write('%s' % str(filename).rjust(5,'0'))
	f.close()
	
def createAVI():
	h = 512
	w = 512
	#fourcc = cv2.cv.CV_FOURCC(*'DIVX')
	fourcc = cv2.cv.CV_FOURCC(*'X264')
	video = cv2.VideoWriter('video.avi',fourcc,1,(w,h))
	images = glob.glob('cloudfree/*.png')
	for image in images:
		img = cv2.imread(image)
		video.write(img)
	cv2.destroyAllWindows()
	video.release()
	

if __name__ == "__main__":
    print "Step 1"
    animateOutput = sys.argv[1]
    print "Step 2"
    URLS = animateOutput.split()
    print URLS
    print "Step 3"
    dims = getMatrixDims(URLS)
    print "Step 4"
    createImages(dims)
    print "Step 5"
    createAVI()

