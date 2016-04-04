using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Geo4Students.Models.Domain.Klimatogrammen
{
    [Table("Meting")]
    public class Meting
    {
        public Meting()
        {
        }

        public Meting(int i, double d, int i1)
        {
            Maand = (Maand)i;
            Temperatuur = d;
            Neerslag = i1;
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int MetingId { get; set; }

        public Maand Maand { get; set; }
        public int Neerslag { get; set; }
        public double Temperatuur { get; set; }
    }
}