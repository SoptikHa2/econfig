/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2016
 * @compiler Bridge.NET 15.5.0
 */
Bridge.assembly("Elektronova konfigurace", function ($asm, globals) {
    "use strict";

    Bridge.define("Elektronova_konfigurace.App", {
        statics: {
            editCanvas: function (electrons) {
                var canvas = Bridge.cast(document.getElementById("canvas"), HTMLCanvasElement);

                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                var xBodu = (Bridge.Int.div(canvas.width, 100)) | 0;
                var yBodu = (Bridge.Int.div(canvas.height, 100)) | 0;

                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(((((Bridge.Int.div(canvas.width, 2)) | 0) - ((Bridge.Int.div(xBodu, 2)) | 0)) | 0), ((((Bridge.Int.div(canvas.height, 2)) | 0) - ((Bridge.Int.div(xBodu, 2)) | 0)) | 0), xBodu, yBodu);
                ctx.fillStyle = "black";
                ctx.stroke();
                ctx.closePath();


                var r = 0;
                for (var i = 0; i < electrons.length; i = (i + 1) | 0) {
                    // 95% vysky canvasu / pocet vrstev -> r dane vrstvy
                    r = (r + (((Bridge.Int.div((((Bridge.Int.div((((canvas.height - (((((Bridge.Int.div(canvas.height, 100)) | 0)) * 5) | 0)) | 0)), 2)) | 0)), (electrons.length))) | 0))) | 0;
                    ctx.beginPath();
                    ctx.arc(((Bridge.Int.div(canvas.width, 2)) | 0), ((Bridge.Int.div(canvas.height, 2)) | 0), r, 0, 360);
                    ctx.stroke();
                    ctx.closePath();

                    var stupen = new (System.Collections.Generic.List$1(System.Double))();
                    stupen.add(0);
                    var rozdil = 360.0 / electrons[i];
                    for (var j = 1; j < electrons[i]; j = (j + 1) | 0) {
                        stupen.add(stupen.getItem(((stupen.getCount() - 1) | 0)) + rozdil);
                    }
                    Elektronova_konfigurace.App.posElectronsByDegree(canvas, ctx, stupen.toArray(), r, xBodu, yBodu);
                }
            },
            clearCanvas: function () {
                var canvas = Bridge.cast(document.getElementById("canvas"), HTMLCanvasElement);

                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            posElectronsByDegree: function (canvas, ctx, degrees, r, xBodu, yBodu) {
                var $t;
                $t = Bridge.getEnumerator(degrees);
                while ($t.moveNext()) {
                    var i = $t.getCurrent();
                    var radiany = i * Math.PI / 180;
                    var x = Math.cos(radiany) * r + ((Bridge.Int.div(canvas.width, 2)) | 0);
                    var y = Math.sin(radiany) * r + ((Bridge.Int.div(canvas.height, 2)) | 0);


                    ctx.beginPath();
                    ctx.fillRect(((Bridge.Int.clip32(x) - ((Bridge.Int.div(xBodu, 2)) | 0)) | 0), ((Bridge.Int.clip32(y) - ((Bridge.Int.div(yBodu, 2)) | 0)) | 0), xBodu, yBodu);
                    ctx.stroke();
                    ctx.closePath();

                }

            }
        },
        $main: function () {
            var input = Bridge.cast(document.getElementById("protonNumber"), HTMLInputElement);
            var vysledek = Bridge.cast(document.getElementById("vysledek"), HTMLParagraphElement);
            vysledek.innerHTML = "";
            input.oninput = function (ev) {
                var i = { v : 0 };
                if (System.Int32.tryParse(input.value, i) && i.v > 0) {
                    if (i.v > 17518) {
                        i.v = 17518;
                        input.value = "17518";
                    }
                    var c = new Elektronova_konfigurace.Config(i.v);
                    vysledek.innerHTML = System.String.replaceAll(c.generate(), "\n", "<br />");
                    Elektronova_konfigurace.App.editCanvas(c.electrons.toArray());
                } else {
                    vysledek.innerHTML = "";
                    Elektronova_konfigurace.App.clearCanvas();
                }
            };


        }
    });

    Bridge.define("Elektronova_konfigurace.Config", {
        protonNumber: 0,
        letterList: null,
        unsortedLetterList: null,
        log: null,
        electrons: null,
        elements: null,
        config: {
            init: function () {
                this.elements = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"];
            }
        },
        ctor: function (protonNumber) {
            this.$initialize();
            this.protonNumber = protonNumber;

            this.letterList = new (System.Collections.Generic.List$1(System.Char))();
            this.letterList.add(115);
            this.unsortedLetterList = new (System.Collections.Generic.List$1(System.Char))();
            this.unsortedLetterList.add(115);
            this.log = "Elektronová konfigurace po vrstvách:\n\n";
            this.electrons = new (System.Collections.Generic.List$1(System.Int32))();
        },
        generate: function () {
            var $t, $t1;
            var vrstva = 1;

            // Repeat until all electrons are positioned
            while (System.Linq.Enumerable.from(this.electrons).sum() < this.protonNumber) {
                var exit = false;
                // Add new line of electrons
                this.electrons.add(0);
                this.log = System.String.concat(this.log, (System.String.format("{0}", System.String.alignString((System.String.concat(vrstva.toString(), ")")), -4))));


                // Do the line
                $t = Bridge.getEnumerator(this.letterList);
                while ($t.moveNext()) {
                    var letter = $t.getCurrent();
                    var maxEl = 2;

                    maxEl = (maxEl + (((this.unsortedLetterList.indexOf(letter) * 4) | 0))) | 0;


                    if ((vrstva === 6 || vrstva === 7) && letter === this.letterList.getItem(1) && ((this.protonNumber - (((System.Linq.Enumerable.from(this.electrons).sum() - System.Linq.Enumerable.from(this.electrons).last()) | 0))) | 0) <= 17) {
                        this.electrons.setItem((((((vrstva + this.getLetterBonus(100)) | 0)) - 1) | 0), (this.electrons.getItem((((((vrstva + this.getLetterBonus(100)) | 0)) - 1) | 0)) + 1) | 0);
                        this.log = System.String.concat(this.log, (System.String.format("{0}d{1} ", (((vrstva + this.getLetterBonus(100)) | 0)).toString(), this.getUpperIndexOfNumber(1))));
                        maxEl = (maxEl - 1) | 0;
                    }



                    // Do all electrons in current 'letter'
                    var i = 0;
                    for (i = 0; i < maxEl; i = (i + 1) | 0) {


                        if (System.Linq.Enumerable.from(this.electrons).sum() >= this.protonNumber) {
                            exit = true;
                            break;
                        }


                        var vrstvaKPridani = ((((vrstva + this.getLetterBonus(letter)) | 0)) - 1) | 0;

                        this.electrons.setItem(vrstvaKPridani, (this.electrons.getItem(vrstvaKPridani) + 1) | 0);
                    }

                    if (letter === 100) {
                        if (i === 4 || i === 9) {
                            i = (i + 1) | 0;
                            this.electrons.setItem((((((vrstva + this.getLetterBonus(100)) | 0)) - 1) | 0), (this.electrons.getItem((((((vrstva + this.getLetterBonus(100)) | 0)) - 1) | 0)) + 1) | 0);
                            this.electrons.setItem(((vrstva - 1) | 0), (this.electrons.getItem(((vrstva - 1) | 0)) - 1) | 0);
                            this.log = System.String.replaceAll(this.log, System.String.format("{0}s²", vrstva.toString()), System.String.format("{0}s{1}", vrstva.toString(), this.getUpperIndexOfNumber(1)));
                        }
                    } else if (letter === 102) {
                        if (i === 6 || i === 13) {
                            i = (i + 1) | 0;
                            this.electrons.setItem((((((vrstva + this.getLetterBonus(102)) | 0)) - 1) | 0), (this.electrons.getItem((((((vrstva + this.getLetterBonus(102)) | 0)) - 1) | 0)) + 1) | 0);
                            if (!System.String.contains(this.log,System.String.format("{0}d{1}", ((vrstva + this.getLetterBonus(100)) | 0), this.getUpperIndexOfNumber(1)))) {
                                this.log = System.String.replaceAll(this.log, System.String.format("{0}s²", vrstva.toString()), System.String.format("{0}s{1}", vrstva.toString(), this.getUpperIndexOfNumber(1)));
                                this.electrons.setItem(((vrstva - 1) | 0), (this.electrons.getItem(((vrstva - 1) | 0)) - 1) | 0);
                            } else {
                                this.electrons.setItem(((((vrstva - 1) | 0) + this.getLetterBonus(100)) | 0), (this.electrons.getItem(((((vrstva - 1) | 0) + this.getLetterBonus(100)) | 0)) - 1) | 0);
                                this.log = System.String.replaceAll(this.log, System.String.format("{0}d{1} ", (((vrstva + this.getLetterBonus(100)) | 0)).toString(), this.getUpperIndexOfNumber(1)), "");
                            }
                        }
                    }


                    if (exit) {
                        if (i !== 0) {
                            this.log = System.String.concat(this.log, (System.String.concat((((vrstva + this.getLetterBonus(letter)) | 0)).toString(), String.fromCharCode(letter), this.getUpperIndexOfNumber(i))));
                        }
                        break;
                    } else if (i !== 0) {
                        this.log = System.String.concat(this.log, (System.String.concat((((vrstva + this.getLetterBonus(letter)) | 0)).toString(), String.fromCharCode(letter), this.getUpperIndexOfNumber(maxEl), " ")));
                    }

                }
                this.log = System.String.concat(this.log, "\n");
                vrstva = (vrstva + 1) | 0;
                this.addLetter(vrstva);
            }


            var j = 0;
            this.log = System.String.concat(this.log, "\n\n\nPočty elektronů v jednotlivých vrstvách:\n\n");
            $t1 = Bridge.getEnumerator(this.electrons);
            while ($t1.moveNext()) {
                var e = $t1.getCurrent();
                this.log = System.String.concat(this.log, (System.String.format("{0}{1}\n", System.String.alignString((System.String.concat((((j + 1) | 0)).toString(), ")")), -4), e)));
                j = (j + 1) | 0;
            }


            return this.log;
        },
        getUpperIndexOfNumber: function (number) {
            var s = "";

            var nmbr = System.Linq.Enumerable.from(number.toString()).first();

            switch (nmbr) {
                case 49: 
                    s = System.String.concat(s, "¹");
                    break;
                case 50: 
                    s = System.String.concat(s, "²");
                    break;
                case 51: 
                    s = System.String.concat(s, "³");
                    break;
                case 52: 
                    s = System.String.concat(s, "⁴");
                    break;
                case 53: 
                    s = System.String.concat(s, "⁵");
                    break;
                case 54: 
                    s = System.String.concat(s, "⁶");
                    break;
                case 55: 
                    s = System.String.concat(s, "⁷");
                    break;
                case 56: 
                    s = System.String.concat(s, "⁸");
                    break;
                case 57: 
                    s = System.String.concat(s, "⁹");
                    break;
                case 48: 
                    s = System.String.concat(s, "⁰");
                    break;
            }

            if (number.toString().length > 1) {
                s = System.String.concat(s, (this.getUpperIndexOfNumber(System.Int32.parse(number.toString().substr(1)))));
            }

            return s;
        },
        addLetter: function (vrstva) {
            if (!this.letterList.contains(112)) {
                if (vrstva > 1) {
                    this.letterList.add(112);
                    this.unsortedLetterList.add(112);
                }
            } else if (!this.letterList.contains(100)) {
                if (vrstva > 3) {
                    this.letterList.insert(1, 100);
                    this.unsortedLetterList.add(100);
                }
            } else if (!this.letterList.contains(102)) {
                if (vrstva > 5) {
                    this.letterList.insert(1, 102);
                    this.unsortedLetterList.add(102);
                }
            } else {
                if (vrstva > (((5 + ((((((((((this.letterList.getItem(1) + 1) | 0)) - 102) | 0) === 0) ? 1 : (((((this.letterList.getItem(1) + 1) | 0)) - 102) | 0)) * 2) | 0))) | 0))) {
                    this.unsortedLetterList.add((((((this.letterList.getItem(1) + 1) | 0))) & 65535));
                    this.letterList.insert(1, (((((this.letterList.getItem(1) + 1) | 0))) & 65535));
                }
            }
        },
        getLetterBonus: function (letter) {
            var bonus = 0;

            if (letter !== 112 && letter !== 115) {
                if (letter === 100) {
                    bonus = -1;
                } else {
                    if (letter === 102) {
                        bonus = -2;
                    } else {
                        bonus = (-2 - (((letter - 102) | 0))) | 0;
                    }
                }
            }

            return bonus;
        }
    });
});
