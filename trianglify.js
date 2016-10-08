var trianglify = document.getElementById('trianglify');
var dimensions = trianglify.getClientRects()[0];
var pattern = Trianglify({
    width: dimensions.width,
    height: dimensions.height
});
trianglify.appendChild(pattern.canvas());
