using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Domain.Determinatietabellen.Parameters
{
    public class Tw : Parameter
    {
        public override string Omschrijving
        {
            get { return "Wat is de temperatuur van de warmste maand?"; }
        }

        public override string Code
        {
            get { return "Tw"; }
        }

        public override List<string> Execute(Klimatogram klimatogram)
        {
            List<string> list = new List<string>();
            list.Add(klimatogram.WarmsteTemp.ToString());
            return list;
        }

        public override List<string> GeefMogelijkeAntwoorden(Klimatogram klimatogram)
        {
            var random = new Random();
            var resultaten = klimatogram.Metingen.Select(m => m.Temperatuur.ToString()).ToList();

            for (var i = 0; i < resultaten.Count*10; ++i)
            {
                var randomPos = random.Next(0, resultaten.Count);

                var resultaat = resultaten.ElementAt(randomPos);

                resultaten.RemoveAt(randomPos);
                resultaten.Add(resultaat);
            }
            return resultaten;
        }
    }
}