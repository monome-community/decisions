inlets = 1;
outlets = 6;

var THRESH = 8;
var WARPS = 1; // jump to random spot if landed on block
var XSIZE = 8;
var YSIZE = 8;

var x = 0;
var y = 0;
var nx, ny, nd;
var d = 0; // direction: 0=east 1=north 2=west 3=south
var c = 0; // count
var jump = 0;
var dontcrashplease;

var t = 0; // timer

var l = new Array(0,0,0);

var i1, i2;

var dd = [[1,0],[0,1],[-1,0],[0,-1]];

var r = new Array(4);
r[0] = 1;
r[1] = 1;
r[2] = 1;
r[3] = 1;

var p = new Array(256);
var m = new Array(256);


function describe_it(num)
{
    if(num==0) assist("x");
    else if(num==1) assist("y");
    else if(num==2) assist("d");
    else if(num==3) assist("c");
    else if(num==4) assist("/grid/led/set");
	else if(num==5) assist("keys held down");
}
//setoutletassist(-1,describe_it); // this shit crashes everything

function redraw() {
	for(i1 = 0;i1<YSIZE; i1++)
	for(i2 = 0;i2<XSIZE; i2++)
	{
		l = [i2,i1,(m[i2+i1*16]==1)];
		outlet(4,l);
	}
}

function size(sx, sy) {
	XSIZE = sx;
	YSIZE = sy;
}

function point(kx, ky, state) {
    if(state==1) {
        p[kx+ky*16] = t;
    } else {
        if((t - p[kx+ky*16]) > THRESH) toggle(kx, ky);
		else {
			if(m[kx+ky*16]) {
				if(WARPS) {
					l = [x,y,0];
					outlet(4,l);
					x = Math.floor(Math.random() * XSIZE);
					y = Math.floor(Math.random() * YSIZE);
					jump = 1;
				}
			}
			else {
				l = [x,y,0];
				outlet(4,l);
				x = kx;
				y = ky;
				jump = 1;
			}
		}
    }
}

function toggle(kx, ky) {
	i1 = kx+ky*16;
	i2 = m[i1];
	
	m[i1] = !i2;
	
	l = [kx, ky, !i2];
	outlet(4, l);
}

function check(tx, ty, td) {
	dontcrashplease++;
	tx = tx + dd[td][0];
    ty = ty + dd[td][1];
	var ok = (m[tx+ty*16]!=1) && tx<XSIZE && tx>=0 && ty < YSIZE && ty>=0;
	return !ok;
}

function step() {
	l = [x,y,0];
	outlet(4,l);
	
	if(!jump) {
		nd = d;
		dontcrashplease = 0;
		while(check(x,y,nd)) {
			nd =  Math.floor(Math.random() * 4);
			if(dontcrashplease>20) {
				x = Math.floor(Math.random() * XSIZE);
				y = Math.floor(Math.random() * YSIZE);
				outlet(5,t);
			}
		}
		
		x = ((x + dd[nd][0]) + XSIZE) % XSIZE;
    	y = ((y + dd[nd][1]) + YSIZE) % YSIZE;

		if(nd != d) { c = 0; d = nd; }

	}
	
	jump = 0;
	

	l = [x,y,1];
	outlet(4,l);

    outlet(0,x);
    outlet(1,y);
    outlet(2,d);
	outlet(3,c);
	
	c++

}

function bang() {
	t++;
}