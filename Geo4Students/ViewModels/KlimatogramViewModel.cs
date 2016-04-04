using System;
using System.Drawing;
using System.Linq;
using System.Web.Mvc;
using DotNet.Highcharts;
using DotNet.Highcharts.Enums;
using DotNet.Highcharts.Helpers;
using DotNet.Highcharts.Options;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.ViewModels
{
    public class KlimatogramViewModel
    {
        public int? SelectedContinentId { get; set; }
        public int? SelectedLandId { get; set; }
        public int? SelectedKlimatogramId { get; set; }
        public SelectList Continenten { get; set; }
        public SelectList Landen { get; set; }
        public SelectList Klimatogrammen { get; set; }
        public Klimatogram Klimatogram { get; set; }

        private string GetDataString(int month)
        {
            return "<br>" + Klimatogram.Metingen.First(e => (int) e.Maand == month).Temperatuur + " °C<br>" +
                   Klimatogram.Metingen.First(e => (int) e.Maand == month).Neerslag + " mmN";
        }

        public Highcharts CreateChart()
        {
            var neerslag = Klimatogram.Metingen.Select(e => e.Neerslag);
            var temp = Klimatogram.Metingen.Select(e => e.Temperatuur);
            double neerslagMax = 0;
            double tempMax = 0;
            var tempMin = BepaalMin(temp.Min());
            var xString = Klimatogram.X > 0
                ? Math.Abs(Klimatogram.X.Value) + "°NB"
                : Math.Abs(Klimatogram.X.Value) + "°ZB";
            var yString = Klimatogram.Y > 0
                ? Math.Abs(Klimatogram.Y.Value) + "°OL"
                : Math.Abs(Klimatogram.Y.Value) + "°WL";
            if (neerslag.Max() > temp.Max())
            {
                neerslagMax = BepaalMax(neerslag.Max(), tempMin*2);
                tempMax = neerslagMax/2;
            }
            else
            {
                tempMax = BepaalMax(temp.Max(), tempMin);
                neerslagMax = tempMax*2;
            }
            return new Highcharts("chart_" +
                                  (!SelectedKlimatogramId.HasValue
                                      ? Klimatogram.KlimatogramId + ""
                                      : SelectedKlimatogramId + ""))
                .InitChart(new Chart
                {
                    ZoomType = ZoomTypes.Xy,
                    BackgroundColor = new BackColorOrGradient(new Gradient
                    {
                        LinearGradient = new[] {0, 0, 0, 400},
                        Stops = new object[,]
                        {
                            {0, Color.FromArgb(13, 255, 255, 255)},
                            {1, Color.FromArgb(13, 255, 255, 255)}
                        }
                    })
                })
                .SetTitle(new Title
                {
                    Text =
                        (!SelectedKlimatogramId.HasValue
                            ? Klimatogram.Naam + Klimatogram.GetLand()
                            : "Klimatogram " + (SelectedKlimatogramId + 1))
                })
                .SetSubtitle(new Subtitle
                {
                    Text =
                        (SelectedKlimatogramId.HasValue
                            ? null
                            : Klimatogram.Weerstation + ", coördinaten: " + xString + " en "
                              + yString + ", periode metingen: " + Klimatogram.StartJaar + " tot " +
                              Klimatogram.EindJaar)
                })
                .SetLegend(new Legend
                {
                    Enabled = false
                })
                .SetExporting(new Exporting
                {
                    Enabled = false
                })
                .SetCredits(new Credits
                {
                    Enabled = false
                })
                .SetXAxis(new XAxis
                {
                    Categories =
                        new[]
                        {
                            "Jan" + GetDataString(1), "Feb" + GetDataString(2), "Maa" + GetDataString(3),
                            "Apr" + GetDataString(4), "Mei" + GetDataString(5), "Jun" + GetDataString(6),
                            "Jul" + GetDataString(7), "Aug" + GetDataString(8),
                            "Sep" + GetDataString(9), "Okt" + GetDataString(10), "Nov" + GetDataString(11),
                            "Dec" + GetDataString(12)
                        }
                })
                .SetYAxis(new[]
                {
                    new YAxis
                    {
                        Labels = new YAxisLabels
                        {
                            Formatter = "function() { return this.value +'°C'; }",
                            Style = "color: '#000000'"
                        },
                        Title = new YAxisTitle
                        {
                            Text = "Temperatuur in °C",
                            Style = "color: '#FF0000'"
                        },
                        Opposite = true,
                        Min = tempMin,
                        Max = tempMax,
                        TickPixelInterval = 28
                    },
                    new YAxis
                    {
                        Labels = new YAxisLabels
                        {
                            Formatter = "function() { if(this.value >= 0){return this.value +' mmN';} }",
                            Style = "color: '#000000'"
                        },
                        Title = new YAxisTitle
                        {
                            Text = "Neerslag in mmN",
                            Style = "color: '#8EBBEB'"
                        },
                        Min = tempMin*2,
                        Max = neerslagMax,
                        TickPixelInterval = 28
                    }
                })
                .SetTooltip(new Tooltip
                {
                    Formatter =
                        "function() { return this.x; }"
                })
                .SetSeries(new[]
                {
                    new Series
                    {
                        Name = "Neerslag in mmN",
                        Color = ColorTranslator.FromHtml("#8EBBEB"),
                        Type = ChartTypes.Column,
                        YAxis = "1",
                        Data = new Data(neerslag.Select(e => (object) e).ToArray())
                    },
                    new Series
                    {
                        Name = "Temperatuur in °C",
                        Color = ColorTranslator.FromHtml("#FF0000"),
                        Type = ChartTypes.Spline,
                        YAxis = "0",
                        Data = new Data(temp.Select(e => (object) e).ToArray())
                    }
                }
                );
        }

        private double BepaalMax(double value, double min)
        {
            var comparing = Math.Abs(min);
            if (value <= 20 && comparing <= 20)
            {
                return 20;
            }
            if (value <= 20 && comparing <= 20)
            {
                return 20;
            }
            if (value <= 50 && comparing <= 50)
            {
                return 50;
            }
            if (value <= 100 && comparing <= 100)
            {
                return 100;
            }
            if (value <= 200 && comparing <= 200)
            {
                return 200;
            }
            if (value <= 500 && comparing <= 500)
            {
                return 500;
            }
            return 1000;
        }

        private double BepaalMin(double value)
        {
            if (value >= 0)
            {
                return 0;
            }
            if (value >= -20)
            {
                return -20;
            }
            if (value >= -50)
            {
                return -50;
            }
            if (value >= -100)
            {
                return -100;
            }
            if (value >= -200)
            {
                return -200;
            }
            return 0;
        }
    }
}