# Protein Interactions Demonstration in Cytoscape

## Getting Started

How to Deploy this module and set up a working demonstration

### Prerequisites

You need:
Python
An Active Terminal
A Web Browser


### Installing/Setting Up

Clone this repository into a folder running the following command in your terminal 

```
git clone https://github.com/kluthr1/PPIntsCUIs.git
```

Now we need the databases to load into Cytoscape
These can be found here
```
https://drive.google.com/open?id=1GhA6VAmZT5HWUkCASTQoZv7-nss-daJ5
```
Download all the files in the libraries folder and move these files to the libraries folder within the clone repository


## Running 

To effective Run this Program, we need to set up a local http server
We can do this many ways, but the easiest method is utilizing python
First we need to see what Python version you have. This can be done by typing
```
python -V
```

If Python version returned above is 3.X, run the following command in terminal
```
python -m http.server
```
If Python version returned above is 2.X, run the following command in terminal
```
python -m SimpleHTTPServer
```
These commands should output a URL. On my machine the URL is 
```
http://0.0.0.0:8000/
```
It may simply say
```
Serving HTTP on 0.0.0.0 port 8000
```
Or some variety of those numbers. In such case, the URL is 
```
http://0.0.0.0:8000/
```

Opening the URL in your browser, you should then click on the 
```
main.html
```
file

Now You Enjoy!

