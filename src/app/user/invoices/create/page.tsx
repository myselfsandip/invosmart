"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { SelectValue } from '@radix-ui/react-select';
import { IndianRupee, TrashIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ProductItem {
    id: string;
    name: string;
    qty: number;
    price: number;
    discount: number;
    tax: number; // Per-item tax % (not GST)
}

interface GSTSplit {
    cgst: number;
    sgst: number;
    igst: number;
}

const CreateInvoicePage = () => {
    const [productItems, setProductItems] = useState<ProductItem[]>([{
        id: crypto.randomUUID(),
        name: "",
        qty: 1,
        price: 0,
        discount: 0,
        tax: 0,
    }]);
    const [showGST, setShowGST] = useState(false);
    const [gstSplit, setGstSplit] = useState<GSTSplit>({ cgst: 0, sgst: 0, igst: 0 });

    const handleProductItemChange = (id: string, field: keyof ProductItem, value: string) => {
        setProductItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, [field]: field === 'name' ? value : Number(value) }
                    : item
            )
        );
    };

    const handleAddProductItem = () => {
        setProductItems(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: "",
                qty: 1,
                price: 0,
                discount: 0,
                tax: 0,
            }
        ]);
    };

    const handleRemoveProductItem = (id: string) => {
        setProductItems(prev => prev.filter(el => el.id !== id));
    };

    const handleGSTChange = (field: keyof GSTSplit, value: string) => {
        setGstSplit(prev => ({ ...prev, [field]: Number(value) }));
    };

    // Calculations
    const subtotal = productItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const totalDiscount = productItems.reduce((sum, item) => sum + item.discount, 0);
    const taxAmount = productItems.reduce((sum, item) =>
        sum + ((item.qty * item.price) * (item.tax / 100)), 0
    );
    const gstRate = gstSplit.cgst + gstSplit.sgst + gstSplit.igst;
    const gstAmount = subtotal * (gstRate / 100);
    const total = subtotal - totalDiscount + taxAmount + gstAmount;

    return (
        <div>
            <div className='px-4 flex items-center justify-between py-4 mb-3'>
                <h1 className='font-medium text-3xl text-gray-700 dark:text-gray-200'>Create Invoice</h1>

            </div>
            <div className='space-y-8'>
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between gap-10  lg:flex-nowrap sm:flex-wrap">
                            <div className='space-y-2 w-full'>
                                <Label>Invoice Number</Label>
                                <Input type='text' />
                            </div>
                            <div className='space-y-2 w-full'>
                                <Label>Invoice Date</Label>
                                <DatePicker />
                            </div>
                            <div className='space-y-2 w-full'>
                                <Label>Due Date</Label>
                                <DatePicker />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className='flex items-center justify-between  gap-6'>
                    <Card className='w-full'>
                        <CardTitle className='px-4 text-xl font-medium'>Bill From</CardTitle>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='space-y-3'>
                                    <Label>Business Name</Label>
                                    <Input type='text' />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Email</Label>
                                    <Input type='email' />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Address</Label>
                                    <Textarea />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Phone</Label>
                                    <Input type='tel' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='w-full'>
                        <CardTitle className='px-4 text-xl font-medium'>Bill To</CardTitle>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='space-y-3'>
                                    <Label>Business Name</Label>
                                    <Input type='text' />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Email</Label>
                                    <Input type='email' />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Address</Label>
                                    <Textarea />
                                </div>
                                <div className='space-y-3'>
                                    <Label>Customer Phone</Label>
                                    <Input type='tel' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ITEMS SECTION */}
                <div>
                    <Card>
                        <CardTitle className='px-4 mb-5 text-lg'>Items</CardTitle>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Discount (%)</TableHead>
                                        <TableHead>Tax (%)</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productItems.map(item => {
                                        // Per row total (handling discount as a percentage)
                                        const rowDiscount = (item.qty * item.price) * (item.discount / 100);
                                        const rowTax = ((item.qty * item.price) - rowDiscount) * (item.tax / 100);
                                        const rowTotal = (item.qty * item.price) - rowDiscount + rowTax;
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Input
                                                        type='text'
                                                        value={item.name}
                                                        onChange={e => handleProductItemChange(item.id, "name", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type='number'
                                                        value={item.qty}
                                                        onChange={e => handleProductItemChange(item.id, "qty", e.target.value)}
                                                        min={1}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type='number'
                                                        value={item.price}
                                                        onChange={e => handleProductItemChange(item.id, "price", e.target.value)}
                                                        min={0}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type='number'
                                                        value={item.discount}
                                                        onChange={e => handleProductItemChange(item.id, "discount", e.target.value)}
                                                        min={0}
                                                        max={100}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type='number'
                                                        value={item.tax}
                                                        onChange={e => handleProductItemChange(item.id, "tax", e.target.value)}
                                                        min={0}
                                                        max={100}
                                                    />
                                                </TableCell>
                                                <TableCell className='px-4'>
                                                    {rowTotal.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleRemoveProductItem(item.id)} type="button" variant="destructive" >
                                                        <TrashIcon className='size-4' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <Button type='button' onClick={handleAddProductItem} className="mt-4 dark:text-gray-200">+ Add Item</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Wrap GST and Notes & Terms in a flex container */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    {/* GST Section */}
                    <div className="lg:w-1/2">
                        <Button
                            variant="outline"
                            type="button"
                            className="flex items-center gap-1 w-full mb-2"
                            onClick={() => setShowGST(v => !v)}
                        >
                            {showGST ? <ChevronUp className='size-4' /> : <ChevronDown className='size-4' />}
                            GST Details (Optional)
                        </Button>
                        {showGST && (
                            <Card>
                                <CardTitle className="px-4 text-lg">GST Split</CardTitle>
                                <CardContent>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 space-y-3">
                                            <Label>CGST (%)</Label>
                                            <Input type="number" value={gstSplit.cgst} min={0} max={100}
                                                onChange={(e) => handleGSTChange("cgst", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <Label>SGST (%)</Label>
                                            <Input type="number" value={gstSplit.sgst} min={0} max={100}
                                                onChange={(e) => handleGSTChange("sgst", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <Label>IGST (%)</Label>
                                            <Input type="number" value={gstSplit.igst} min={0} max={100}
                                                onChange={(e) => handleGSTChange("igst", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Notes & Terms Section */}
                    <Card className="lg:w-1/2 w-full">
                        <CardTitle className='px-4 text-xl font-medium'>Notes & Terms</CardTitle>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='space-y-3'>
                                    <Label>Notes</Label>
                                    <Textarea name='note' />
                                </div>
                                <div className='space-y-3'>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Payment Term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Payment Terms</SelectLabel>
                                                <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                                                <SelectItem value="net_7">Net 7 Days</SelectItem>
                                                <SelectItem value="net_10">Net 10 Days</SelectItem>
                                                <SelectItem value="net_15">Net 15 Days</SelectItem>
                                                <SelectItem value="net_30">Net 30 Days</SelectItem>
                                                <SelectItem value="net_45">Net 45 Days</SelectItem>
                                                <SelectItem value="net_60">Net 60 Days</SelectItem>
                                                <SelectItem value="eom">End of Month (EOM)</SelectItem>
                                                <SelectItem value="15_mfi">15th of Following Month</SelectItem>
                                                <SelectItem value="2_10_net_30">2/10 Net 30 (2% Discount if paid within 10 days)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* TOTALS SECTION remains below */}
                <div className='mb-10'>
                    <Card className='w-full'>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center justify-between px-2'>
                                    <span>Subtotal</span>
                                    <span className='flex items-center gap-2'><IndianRupee className='size-4' /> {subtotal.toFixed(2)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className='flex items-center justify-between px-2'>
                                        <span>Discount</span>
                                        <span className='flex items-center gap-2'>-<IndianRupee className='size-4' /> {totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className='flex items-center justify-between px-2'>
                                        <span>Tax</span>
                                        <span className='flex items-center gap-2'><IndianRupee className='size-4' /> {taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {gstAmount > 0 && (
                                    <div className='flex items-center justify-between px-2'>
                                        <span>GST (CGST+SGST+IGST)</span>
                                        <span className='flex items-center gap-2'><IndianRupee className='size-4' /> {gstAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className='flex items-center justify-between px-2 font-medium text-lg'>
                                    <span>Total</span>
                                    <span className='flex items-center gap-2'><IndianRupee className='size-4' /> {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <div className='flex items-center justify-end mb-5'>
                    <Button className='dark:text-gray-200'>Save Invoice</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoicePage;
