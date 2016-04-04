using System.Collections.Generic;
using Geo4Students.Models.Domain.Determinatietabellen.Parameters;

namespace Geo4Students.Models.Domain.Determinatietabellen
{
    public class ParameterFactory
    {
        public static Parameter CreateParameter(string type)
        {
            switch (type.ToLower())
            {
                case "nj":
                    return new Nj();
                case "tj":
                    return new Tj();
                case "tk":
                    return new Tk();
                case "tw":
                    return new Tw();
                case "mk":
                    return new Mk();
                case "mw":
                    return new Mw();
                case "nz":
                    return new Nz();
                case "nw":
                    return new Nw();
                case "d":
                    return new D();
                case "m (tm >= 10)":
                    return new M();
            }
            return null;
        }

        public static Parameter CreateParameter(string type, int maand)
        {
            return new Tm(maand);
        }

        public static List<Parameter> FindAll()
        {
            return new List<Parameter> {new Tk(), new Tw(), new Mk(), new Mw(), new Nz(), new Nw(), new D()};
        }
    }
}