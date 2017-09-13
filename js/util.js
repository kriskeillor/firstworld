function toRad(deg) {
	return (deg / 180) * Math.PI;
}

function wrapDegrees(deg) {
	while (deg < 0) 
		deg += 360;
	return deg % 360;
}

function roundToTenth(n){
	return Math.round(n * 10) / 10;
}

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}

/**
 * A linear interpolator for hexadecimal colors
 * Thanks to rosszurowski on github 
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
function lerpColor(a, b, amount) { 
    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function smoothStep (v1, v2, weight) {
	var n = Math.max(0, Math.min(1, (weight-v1)/(v2-v1)));
	return n*n*(3 - 2*n);
};