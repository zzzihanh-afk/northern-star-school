import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { LibraryBook } from '../../types';
import {
  BookOpen,
  Search,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';

export const StudentLibraryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  const books: LibraryBook[] = dataService.getBooks();

  const myBorrowedBooks = [
    {
      title: 'Fundamentals of Physics (Extended Edition)',
      author: 'Halliday, Resnick & Walker',
      accessionNo: 'LIB-PHY-2041',
      borrowedDate: '2025-04-10',
      dueDate: '2025-05-10',
      status: 'active'
    },
    {
      title: 'Higher Algebra & Coordinate Geometry',
      author: 'Prof. S.U. Ahammad',
      accessionNo: 'LIB-MTH-1089',
      borrowedDate: '2025-04-14',
      dueDate: '2025-05-14',
      status: 'active'
    }
  ];

  const handleRequestBook = (book: LibraryBook) => {
    if (book.availableCopies <= 0) return;
    setRequestSuccess(language === 'bn' 
      ? `"${book.title}" বইটির জন্য আপনার রিকুয়েস্ট লাইব্রেরিয়ান ডেস্কে পাঠানো হয়েছে। কার্ড দেখিয়ে সংগ্রহ করুন।` 
      : `Borrow request for "${book.title}" placed! Please present your student ID at Central Library counter.`);
    setTimeout(() => setRequestSuccess(null), 4500);
  };

  const categories = ['all', 'Science', 'Mathematics', 'Literature', 'Social Science', 'Computing'];

  const filteredBooks = books.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.accessionNo.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-royal" />
            <span>{language === 'bn' ? 'সেন্ট্রাল লাইব্রেরি ও ডিজিটাল ক্যাটালগ' : 'Central Library & Digital Catalogue'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'স্কুল ও কলেজ শাখার ২০,০০০+ পাঠ্য ও রেফারেন্স বই অনুসন্ধান করুন এবং সংগ্রহ রিকুয়েস্ট দিন।' 
              : 'Search physical and reference textbooks, inspect shelf locations, and place circulation holds.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-status-green border border-emerald-200">
            {language === 'bn' ? 'সংগৃহীত বই:' : 'Borrowed by You:'} <strong>{toLocaleNumber(myBorrowedBooks.length, language)}</strong>
          </span>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {requestSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{requestSuccess}</span>
        </div>
      )}

      {/* MY BORROWED BOOKS SECTION */}
      <div className="bg-surface rounded-2xl p-5 border border-slate-border shadow-card space-y-3">
        <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-royal" />
          <span>{language === 'bn' ? 'বর্তমানে আপনার নিকট সংগৃহীত বইসমূহ' : 'Currently Borrowed Books & Due Return Dates'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myBorrowedBooks.map((mb, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-navy-950 block">{mb.title}</span>
                <span className="text-[11px] text-slate-500">{mb.author} • {mb.accessionNo}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">{language === 'bn' ? 'ফেরতের তারিখ:' : 'Due Date:'}</span>
                <span className="font-mono font-bold text-status-orange">{mb.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH & CATEGORY BAR */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'বইয়ের নাম, লেখক বা কোড খুঁজুন...' : 'Search title, author, accession no...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-royal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? (
                cat === 'all' ? 'সকল' :
                cat === 'Science' ? 'বিজ্ঞান' :
                cat === 'Mathematics' ? 'গণিত' :
                cat === 'Literature' ? 'সাহিত্য' :
                cat === 'Social Science' ? 'সমাজবিজ্ঞান' : 'কম্পিউটিং'
              ) : cat}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
          const isAvailable = book.availableCopies > 0;
          return (
            <div
              key={book.id}
              className="bg-surface rounded-2xl p-5 border border-slate-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    {book.accessionNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isAvailable ? 'bg-emerald-50 text-status-green border border-emerald-200' : 'bg-rose-50 text-status-red border border-rose-200'
                    }`}
                  >
                    {isAvailable 
                      ? (language === 'bn' ? `${toLocaleNumber(book.availableCopies, language)} কপি অবশিষ্ট` : `${book.availableCopies} Available`) 
                      : (language === 'bn' ? 'সকল কপি ইস্যুকৃত' : 'Issued Out')}
                  </span>
                </div>

                <h3 className="font-bold text-navy-950 text-sm leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'bn' ? 'লেখক:' : 'Author:'} {book.author}
                </p>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-royal" />
                  <span>{language === 'bn' ? 'শেলফ অবস্থান:' : 'Location:'} <strong>{book.shelfLocation}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {language === 'bn' ? `মোট কপি: ${toLocaleNumber(book.totalCopies, language)}` : `Total copies: ${book.totalCopies}`}
                </span>

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleRequestBook(book)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs ${
                    isAvailable
                      ? 'bg-royal hover:bg-royal-hover text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ইস্যু রিকুয়েস্ট' : 'Request Book'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
