import { mutation } from './_generated/server';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const seedCourses = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Delete all existing courses, modules, units, and related data
    const existingCourses = await ctx.db.query('courses').collect();
    for (const course of existingCourses) {
      const modules = await ctx.db.query('modules').withIndex('by_course_order', (q) => q.eq('courseId', course._id)).collect();
      for (const mod of modules) {
        const units = await ctx.db.query('units').withIndex('by_module_order', (q) => q.eq('moduleId', mod._id)).collect();
        for (const unit of units) {
          await ctx.db.delete(unit._id);
        }
        await ctx.db.delete(mod._id);
      }
      const enrollments = await ctx.db.query('enrollments').withIndex('by_course', (q) => q.eq('courseId', course._id)).collect();
      for (const e of enrollments) {
        await ctx.db.delete(e._id);
      }
      await ctx.db.delete(course._id);
    }

    // Define the 3 courses
    const courseDefs = [
      {
        title: "Discipleship 101",
        synopsis: "Understanding the foundations of faith.",
        modules: [
          {
            title: "Introduction to Faith",
            description: "",
            units: [
              { title: "What is Faith?", type: "text" as const },
              { title: "The Grace of God", type: "text" as const },
              { title: "Repentance", type: "text" as const },
              { title: "Assignment: Reflection", type: "assignment" as const },
            ]
          },
          {
            title: "The Bible",
            description: "",
            units: [
              { title: "How to Read the Bible", type: "text" as const },
              { title: "Old Testament Overview", type: "text" as const },
              { title: "New Testament Overview", type: "text" as const },
            ]
          }
        ]
      },
      {
        title: "Career Guidance",
        synopsis: "Navigating choices and discovering purpose.",
        modules: [
          {
            title: "Discovering Gifts",
            description: "",
            units: [
              { title: "Spiritual Gifts", type: "text" as const },
              { title: "Talents & Skills", type: "text" as const },
              { title: "Personality Tests", type: "text" as const },
            ]
          },
          {
            title: "Practical Steps",
            description: "",
            units: [
              { title: "CV Writing", type: "text" as const },
              { title: "Interview Skills", type: "text" as const },
              { title: "Workplace Ethics", type: "text" as const },
            ]
          }
        ]
      },
      {
        title: "Digital Literacy",
        synopsis: "Essential computer skills.",
        modules: [
          {
            title: "Computer Basics",
            description: "",
            units: [
              { title: "Hardware vs Software", type: "text" as const },
              { title: "Operating Systems", type: "text" as const },
              { title: "File Management", type: "text" as const },
            ]
          },
          {
            title: "Office Suite",
            description: "",
            units: [
              { title: "Word Processing", type: "text" as const },
              { title: "Spreadsheets", type: "text" as const },
              { title: "Presentations", type: "text" as const },
            ]
          }
        ]
      }
    ];

    const createdCourses = [];

    for (const courseDef of courseDefs) {
      const courseId = await ctx.db.insert('courses', {
        title: courseDef.title,
        slug: slugify(courseDef.title),
        synopsis: courseDef.synopsis,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      });

      createdCourses.push(courseId);

      for (let mIdx = 0; mIdx < courseDef.modules.length; mIdx++) {
        const modDef = courseDef.modules[mIdx];
        const moduleId = await ctx.db.insert('modules', {
          courseId,
          title: modDef.title,
          description: modDef.description,
          order: mIdx,
          createdAt: now,
          updatedAt: now,
        });

        for (let uIdx = 0; uIdx < modDef.units.length; uIdx++) {
          const unitDef = modDef.units[uIdx];
          await ctx.db.insert('units', {
            courseId,
            moduleId,
            title: unitDef.title,
            order: uIdx,
            type: unitDef.type,
            richText: '',
            estimatedMinutes: 30,
            status: 'draft',
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    return { created: createdCourses.length, courses: createdCourses };
  }
});
