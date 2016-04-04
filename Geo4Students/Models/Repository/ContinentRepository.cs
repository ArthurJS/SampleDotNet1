using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Repository
{
    public class ContinentRepository : IGenericRepository<Continent>
    {
        private readonly GeoContext _context;
        private readonly DbSet<Continent> _continenten;

        public ContinentRepository(GeoContext context)
        {
            _context = context;
            _continenten = _context.Continent;
        }

        public IQueryable<Continent> FindAll()
        {
            return _continenten;
        }

        public Continent Get(object id)
        {
            return _continenten.Find(id);
        }

        public void Delete(Continent obj)
        {
            _continenten.Remove(obj);
        }

        public void Insert(Continent obj)
        {
            _continenten.Add(obj);
        }

        public bool Exists(object id)
        {
            return _continenten.Find(id) != null;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}