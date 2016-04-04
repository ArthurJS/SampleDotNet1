using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Repository;
using Ninject.Infrastructure.Language;

namespace Geo4Students.Models.Domain.Klimatogrammen
{
    [Table("Klimatogram")]
    public class Klimatogram
    {
        public Klimatogram()
        {
        }

        public Klimatogram(string naam, int klimatogramId, int? eindJaar, int? startJaar, string weerstation, double? x,
            double? y)
        {
            Naam = naam;
            KlimatogramId = klimatogramId;
            EindJaar = eindJaar;
            StartJaar = startJaar;
            Weerstation = weerstation;
            X = x;
            Y = y;
            Metingen = new List<Meting>();
        }

        public Klimatogram(string naam, string weerstation, double x, double y, int startJaar, int eindJaar)
        {
            Naam = naam;
            EindJaar = eindJaar;
            StartJaar = startJaar;
            Weerstation = weerstation;
            X = x;
            Y = y;
            Metingen = new List<Meting>();
        }

        public int KlimatogramId { get; private set; }
        public int? EindJaar { get; private set; }

        [StringLength(255)]
        public string Naam { get; private set; }

        public int? StartJaar { get; private set; }

        [StringLength(255)]
        public string Weerstation { get; private set; }

        public double? X { get; private set; }
        public double? Y { get; private set; }
        public virtual ICollection<Meting> Metingen { get; private set; }

        public int SomNeerslagZomer
        {
            get
            {
                return X > 0
                    ? Metingen.Where(meting => (int) meting.Maand >= 4 && (int) meting.Maand <= 9)
                        .Sum(meting => meting.Neerslag)
                    : Metingen.Where(meting => (int) meting.Maand >= 10 || (int) meting.Maand <= 3)
                        .Sum(meting => meting.Neerslag);
            }
        }

        public int SomNeerslagWinter
        {
            get
            {
                return X <= 0
                    ? Metingen.Where(meting => (int) meting.Maand >= 4 && (int) meting.Maand <= 9)
                        .Sum(meting => meting.Neerslag)
                    : Metingen.Where(meting => (int) meting.Maand >= 10 || (int) meting.Maand <= 3)
                        .Sum(meting => meting.Neerslag);
            }
        }

        public List<string> WarmsteMaand
        {
            get { return Metingen.Where(e => e.Temperatuur >= Metingen.Max(t => t.Temperatuur)).Select(a => a.Maand.ToString()).ToList(); }
        }

        public double WarmsteTemp
        {
            get { return Metingen.Max(m => m.Temperatuur); }
        }

        public double KoudsteTemp
        {
            get { return Metingen.Min(m => m.Temperatuur); }
        }

        public List<string> KoudsteMaand
        {
            get { return Metingen.Where(e => e.Temperatuur <= Metingen.Min(t => t.Temperatuur)).Select(a => a.Maand.ToString()).ToList(); }
        }

        public int DrogeMaanden
        {
            get { return Metingen.Count(meting => meting.Neerslag <= 2*meting.Temperatuur); }
        }

        public int TotaleNeerslag()
        {
            return Metingen.Sum(e => e.Neerslag);
        }

        public double GemiddeldeTemp()
        {
            return Math.Round(Metingen.Sum(e => e.Temperatuur)/12, 2);
        }

        public void setMetingen(List<Meting> metingen)
        {
            Metingen = metingen;
        }

        public string GetLand()
        {
            var land =
                new LandRepository(new GeoContext()).FindAll()
                    .FirstOrDefault(l => l.Klimatogrammen.Any(k => k.KlimatogramId == KlimatogramId));
            var continent =
                new ContinentRepository(new GeoContext()).FindAll()
                    .FirstOrDefault(l => l.Landen.Any(la => la.LandId == land.LandId));
            return ", " + land.Naam + ", " + continent.Naam;
        }
    }
}