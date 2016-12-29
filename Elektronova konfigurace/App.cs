using System;
using Bridge;
using Bridge.Html5;
using System.Collections.Generic;
using System.Linq;

namespace Elektronova_konfigurace
{
    public class App
    {
        public static void Main()
        {
            HTMLInputElement input = (HTMLInputElement)Document.GetElementById("protonNumber");
            HTMLParagraphElement vysledek = (HTMLParagraphElement)Document.GetElementById("vysledek");
            vysledek.InnerHTML = "";
            input.OnInput = (ev) =>
            {
                int i = 0;
                if (int.TryParse(input.Value, out i) && i > 0)
                {
                    if (i > 17518)
                    {
                        i = 17518;
                        input.Value = "17518";
                    }
                    Config c = new Config(i);
                    vysledek.InnerHTML = c.Generate().Replace("\n", "<br />");
                    editCanvas(c.electrons.ToArray());
                }
                else { vysledek.InnerHTML = ""; clearCanvas(); }
            };


        }

        private static void editCanvas(int[] electrons)
        {
            HTMLCanvasElement canvas = (HTMLCanvasElement)Document.GetElementById("canvas");

            var ctx = canvas.GetContext("2d").As<CanvasRenderingContext2D>();
            ctx.ClearRect(0, 0, canvas.Width, canvas.Height);

            int xBodu = canvas.Width / 100;
            int yBodu = canvas.Height / 100;

            ctx.BeginPath();
            ctx.FillStyle = "red";
            ctx.FillRect(canvas.Width / 2 - xBodu / 2, canvas.Height / 2 - xBodu / 2, xBodu, yBodu);
            ctx.FillStyle = "black";
            ctx.Stroke();
            ctx.ClosePath();


            int r = 0;
            for (int i = 0; i < electrons.Length; i++)
            {
                // 95% vysky canvasu / pocet vrstev -> r dane vrstvy
                r += ((canvas.Height - (canvas.Height / 100) * 5) / 2) / (electrons.Length);
                ctx.BeginPath();
                ctx.Arc(canvas.Width / 2, canvas.Height / 2, r, 0, 360);
                ctx.Stroke();
                ctx.ClosePath();

                List<double> stupen = new List<double>();
                stupen.Add(0);
                double rozdil = 360d / electrons[i];
                for (int j = 1; j < electrons[i]; j++)
                {
                    stupen.Add(stupen[stupen.Count - 1] + rozdil);
                }
                posElectronsByDegree(canvas, ctx, stupen.ToArray(), r, xBodu, yBodu);
            }
        }

        private static void clearCanvas()
        {
            HTMLCanvasElement canvas = (HTMLCanvasElement)Document.GetElementById("canvas");

            var ctx = canvas.GetContext("2d").As<CanvasRenderingContext2D>();
            ctx.ClearRect(0, 0, canvas.Width, canvas.Height);
        }

        private static void posElectronsByDegree(HTMLCanvasElement canvas, CanvasRenderingContext2D ctx, double[] degrees, int r, int xBodu, int yBodu)
        {
            foreach (double i in degrees)
            {
                double radiany = i * Math.PI / 180;
                double x = Math.Cos(radiany) * r + canvas.Width / 2;
                double y = Math.Sin(radiany) * r + canvas.Height / 2;


                ctx.BeginPath();
                ctx.FillRect((int)x - xBodu / 2, (int)y - yBodu / 2, xBodu, yBodu);
                ctx.Stroke();
                ctx.ClosePath();

            }

        }
    }
}