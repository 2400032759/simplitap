import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Phone, Mail, Globe, Building, User, Trash2, ArrowRight, Plus, ArrowLeft, Save } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useUser } from '@clerk/clerk-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export const ContactsManager = () => {
    const { user } = useUser();
    const supabaseClient = useSupabase();

    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newContact, setNewContact] = useState({
        name: '',
        company: '',
        job_title: '',
        email: '',
        phone: '',
        website: ''
    });

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
    }, [user]);

    const fetchContacts = async () => {
        try {
            console.log("Fetching contacts for user:", user?.id);
            const { data, error } = await supabaseClient
                .from('contacts_v2')
                .select('*')
                // RLS should handle filtering, but we keep this for double safety
                // .eq('user_id', user?.id) 
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase Fetch Error:", error);
                throw error;
            }
            console.log("Fetched contacts:", data);
            setContacts(data || []);
        } catch (err) {
            console.error("Fetch Contacts Caught Error:", err);
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContact = async () => {
        if (!newContact.name.trim()) {
            toast.error("Name is required");
            return;
        }

        setSaving(true);
        try {
            const { data, error } = await supabaseClient
                .from('contacts_v2')
                .insert([{
                    user_id: user?.id,
                    ...newContact,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            setContacts([data, ...contacts]);
            toast.success("Contact added successfully");
            setIsAdding(false);
            setNewContact({ name: '', company: '', job_title: '', email: '', phone: '', website: '' });
        } catch (err: any) {
            console.error("Error adding contact:", err);
            toast.error(err.message || "Failed to add contact");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabaseClient
                .from('contacts_v2')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setContacts(contacts.filter(c => c.id !== id));
            toast.success("Contact deleted");
        } catch (err) {
            toast.error("Failed to delete contact");
        }
    };

    const filteredContacts = contacts.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.job_title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
    };

    const downloadVCard = (contact: any) => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:${contact.company || ''}
TITLE:${contact.job_title || ''}
TEL;TYPE=CELL:${contact.phone || ''}
EMAIL:${contact.email || ''}
URL:${contact.website || ''}
END:VCARD`;
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contact.name || 'contact'}.vcf`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-2">
                <DialogTitle className="flex items-center justify-between">
                    {isAdding ? (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setIsAdding(false)}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <span className="flex items-center gap-2">
                                Add New Contact
                            </span>
                        </div>
                    ) : (
                        <>
                            <span className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Contacts Manager
                            </span>
                            <div className="flex items-center gap-4 mr-8">
                                <span className="text-sm font-normal text-muted-foreground">
                                    {contacts.length} Contacts
                                </span>
                                <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() => setIsAdding(true)}
                                    title="Add Contact Manually"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </DialogTitle>
            </DialogHeader>

            {!isAdding && (
                <div className="px-6 py-2 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-9 bg-gray-50"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <ScrollArea className="flex-1 bg-gray-50/50 p-6">
                {isAdding ? (
                    <div className="bg-white rounded-xl border p-6 space-y-4 max-w-lg mx-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="e.g. John Doe"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Company</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Company Name"
                                        value={newContact.company}
                                        onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Job Title</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Job Title"
                                        value={newContact.job_title}
                                        onChange={(e) => setNewContact({ ...newContact, job_title: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    value={newContact.phone}
                                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="www.example.com"
                                    value={newContact.website}
                                    onChange={(e) => setNewContact({ ...newContact, website: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1" onClick={handleSaveContact} disabled={saving}>
                                {saving ? "Saving..." : "Save Contact"}
                            </Button>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center p-8">Loading...</div>
                ) : filteredContacts.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredContacts.map(contact => (
                            <div key={contact.id} className="bg-white rounded-xl border shadow-sm transition-all hover:shadow-md flex flex-col group relative">
                                <div className="p-4 flex items-start gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {getInitials(contact.name || contact.company)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate pr-6">{contact.name || "Unknown Name"}</h4>
                                        <p className="text-xs text-gray-500 truncate mb-2">{contact.job_title} {contact.company ? `@ ${contact.company}` : ''}</p>

                                        <div className="space-y-1.5 hidden md:block">
                                            {contact.phone && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    {contact.phone}
                                                </div>
                                            )}
                                            {contact.email && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail className="w-3 h-3 text-gray-400" />
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                            )}
                                            {contact.website && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Globe className="w-3 h-3 text-gray-400" />
                                                    <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline truncate">
                                                        {contact.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(contact.id, e)}
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors absolute top-3 right-3"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Actions Footer */}
                                <div className="mt-auto border-t bg-gray-50/50 p-3 flex items-center justify-between gap-2">
                                    <Button
                                        onClick={() => downloadVCard(contact)}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-8 gap-1.5 bg-white border-gray-200 hover:bg-gray-100 hover:text-gray-900 font-medium"
                                    >
                                        <User className="w-3.5 h-3.5" />
                                        Save Contact
                                    </Button>

                                    <div className="flex items-center gap-1.5">
                                        {/* WhatsApp */}
                                        {contact.phone && (
                                            <a
                                                href={`https://wa.me/${contact.phone.replace(/[^\d]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-green-600 hover:bg-green-50 hover:border-green-200 transition-colors shadow-sm"
                                                title="WhatsApp"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                            </a>
                                        )}

                                        {/* Call */}
                                        {contact.phone && (
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                                title="Call"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                            </a>
                                        )}

                                        {/* Email */}
                                        {contact.email && (
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
                                                title="Email"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </a>
                                        )}

                                        {/* Website */}
                                        {contact.website && (
                                            <a
                                                href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm"
                                                title="Website"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-400 opacity-60">
                        <User className="w-12 h-12 mb-4 text-gray-300" />
                        <p>No contacts found.</p>
                        <p className="text-xs">Scan a card to get started.</p>
                    </div>
                )}
            </ScrollArea>
        </DialogContent>
    );
};
