using System.Data.Entity;
using System.Linq;
using Geo4Students.Models.DAL;
using Geo4Students.Models.Domain.Klimatogrammen;

namespace Geo4Students.Models.Repository
{
    public class LandRepository : IGenericRepository<Land>
    {
        private readonly GeoContext _context;
        private readonly DbSet<Land> _landen;

        public LandRepository(GeoContext context)
        {
            _context = context;
            _landen = _context.Land;
        }

        public IQueryable<Land> FindAll()
        {
            return _landen;
        }

        public Land Get(object id)
        {
            return _landen.Find(id);
        }

        public void Delete(Land obj)
        {
            _landen.Remove(obj);
        }

        public void Insert(Land obj)
        {
            _landen.Add(obj);
        }

        public bool Exists(object id)
        {
            return _landen.Find(id) != null;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}