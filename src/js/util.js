module.exports = {
    getPostalZone: getPostalZone,
    roundToTwo: roundToTwo
}

function getPostalZone(code)
{
    let countRegex = 0;
    if(code.match(/G1[BCE]/))
        return countRegex;
    countRegex++
    if(code.match(/G1[JKLPR]/))
        return countRegex;
    countRegex++
    if(code.match(/G1[ST]/))
        return countRegex;
    countRegex++
    if(code.match(/G1[VXW]/))
        return countRegex;
    countRegex++
    if(code.match(/G1Y/))
        return countRegex;
    countRegex++
    if(code.match(/G3A/))
        return countRegex;
    countRegex++
    if(code.match(/G2[EG]/))
        return countRegex;
    countRegex++
    if(code.match(/G3[KJ]/))
        return countRegex;
    countRegex++
    if(code.match(/G2[BC]/))
        return countRegex;
    countRegex++
    if(code.match(/G1G/))
        return countRegex;
    countRegex++
    if(code.match(/G1[HM]|G2[JKL]/))
        return countRegex;
    countRegex++
    if(code.match(/G1N/))
        return countRegex;
    countRegex++
        return countRegex;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}