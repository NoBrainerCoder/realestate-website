import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Calculator, Home, Percent, Calendar, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState([5000000]);
  const [interestRate, setInterestRate] = useState([8.5]);
  const [tenure, setTenure] = useState([20]);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateEMI = () => {
    const principal = loanAmount[0];
    const rate = interestRate[0] / 12 / 100;
    const tenureMonths = tenure[0] * 12;

    if (principal && rate && tenureMonths) {
      const emiValue = (principal * rate * Math.pow(1 + rate, tenureMonths)) / 
                      (Math.pow(1 + rate, tenureMonths) - 1);
      
      const totalPaymentValue = emiValue * tenureMonths;
      const totalInterestValue = totalPaymentValue - principal;

      setEmi(Math.round(emiValue));
      setTotalPayment(Math.round(totalPaymentValue));
      setTotalInterest(Math.round(totalInterestValue));
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="hover-scale">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              EMI Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Calculate your home loan EMI and plan your budget
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Loan Calculator
              </CardTitle>
              <CardDescription>
                Adjust the parameters to calculate your EMI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Loan Amount
                  </Label>
                  <Input
                    type="number"
                    value={loanAmount[0]}
                    onChange={(e) => setLoanAmount([parseInt(e.target.value) || 0])}
                    className="w-32 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    min={1000000}
                    max={50000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10L</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(loanAmount[0])}
                    </span>
                    <span>₹5Cr</span>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-primary" />
                    Interest Rate (% per annum)
                  </Label>
                  <Input
                    type="number"
                    value={interestRate[0]}
                    onChange={(e) => setInterestRate([parseFloat(e.target.value) || 0])}
                    className="w-20 text-right"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Slider
                    value={interestRate}
                    onValueChange={setInterestRate}
                    min={5}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span className="font-medium text-primary">
                      {interestRate[0]}%
                    </span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Loan Tenure (Years)
                  </Label>
                  <Input
                    type="number"
                    value={tenure[0]}
                    onChange={(e) => setTenure([parseInt(e.target.value) || 0])}
                    className="w-20 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Slider
                    value={tenure}
                    onValueChange={setTenure}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 Years</span>
                    <span className="font-medium text-primary">
                      {tenure[0]} Years
                    </span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* EMI Result */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">Monthly EMI</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {formatCurrency(emi)}
                  </div>
                  <div className="text-sm opacity-90">
                    for {tenure[0]} years
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Principal Amount</span>
                  <span className="font-semibold">{formatCurrency(loanAmount[0])}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-semibold text-amber-600">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Total Payment</span>
                  <span className="font-bold text-lg">{formatCurrency(totalPayment)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Visual Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Principal</span>
                    <span className="text-sm font-medium">
                      {((loanAmount[0] / totalPayment) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(loanAmount[0] / totalPayment) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interest</span>
                    <span className="text-sm font-medium">
                      {((totalInterest / totalPayment) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/properties">
                <Button className="w-full btn-hero">
                  <Home className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Get Expert Advice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;