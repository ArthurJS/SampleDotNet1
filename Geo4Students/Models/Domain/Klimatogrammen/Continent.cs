using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Geo4Students.ClassExtensions;

namespace Geo4Students.Models.Domain.Klimatogrammen
{
    [Table("Continent")]
    public class Continent
    {
        public int ContinentId { get; set; }
        public string Naam { get; set; }
        public virtual List<Land> Landen { get; set; }

        public Klimatogram GeefRandomLocatie()
        {
            var k = Landen.SelectMany(l => l.Klimatogrammen).ToList();
            k.Shuffle();
            return k.First();
        }
    }
}