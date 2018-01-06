// SHA1  

class SHA1 {
    static add(x, y) {  
        return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);  
    }  
    
    static SHA1hex(num) {  
        var sHEXChars = "0123456789abcdef";  
        var str = "";  
        for(var j = 7; j >= 0; j--)  
            str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);  
        return str;  
    }  
    
    static AlignSHA1(sIn) {  
        var nblk = ((sIn.length + 8) >> 6) + 1,  
            blks = new Array(nblk * 16);  
        for(var i = 0; i < nblk * 16; i++) blks[i] = 0;  
        for(i = 0; i < sIn.length; i++)  
            blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);  
        blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);  
        blks[nblk * 16 - 1] = sIn.length * 8;  
        return blks;  
    }  
    
    static rol(num, cnt) {  
        return(num << cnt) | (num >>> (32 - cnt));  
    }  
    
    static ft(t, b, c, d) {  
        if(t < 20) return(b & c) | ((~b) & d);  
        if(t < 40) return b ^ c ^ d;  
        if(t < 60) return(b & c) | (b & d) | (c & d);  
        return b ^ c ^ d;  
    }  
    
    static kt(t) {  
        return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 :  
            (t < 60) ? -1894007588 : -899497514;  
    }  
    
    static crypto(sIn) {  
        var x = SHA1.AlignSHA1(sIn);  
        var w = new Array(80);  
        var a = 1732584193;  
        var b = -271733879;  
        var c = -1732584194;  
        var d = 271733878;  
        var e = -1009589776;  
        let t = 0;
        for(var i = 0; i < x.length; i += 16) {  
            var olda = a;  
            var oldb = b;  
            var oldc = c;  
            var oldd = d;  
            var olde = e;  
            for(var j = 0; j < 80; j++) {  
                if(j < 16) w[j] = x[i + j];  
                else w[j] = SHA1.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);  
                t = SHA1.add(SHA1.add(SHA1.rol(a, 5), SHA1.ft(j, b, c, d)), SHA1.add(SHA1.add(e, w[j]), SHA1.kt(j)));  
                e = d;  
                d = c;  
                c = SHA1.rol(b, 30);  
                b = a;  
                a = t;  
            }  
            a = SHA1.add(a, olda);  
            b = SHA1.add(b, oldb);  
            c = SHA1.add(c, oldc);  
            d = SHA1.add(d, oldd);  
            e = SHA1.add(e, olde);  
        }  
        let SHA1Value = SHA1.SHA1hex(a) + SHA1.SHA1hex(b) + SHA1.SHA1hex(c) + SHA1.SHA1hex(d) + SHA1.SHA1hex(e);  
        return SHA1Value.toUpperCase();  
    }  
    
    static crypto2(sIn) {  
        return SHA1.crypto(sIn).toLowerCase();  
    }  
}
