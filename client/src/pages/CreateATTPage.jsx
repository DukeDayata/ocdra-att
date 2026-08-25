import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FilePlus, Edit3, Loader2, ArrowLeft, CheckCircle, MapPin, Users, DollarSign, PenTool, Save } from 'lucide-react';
import { TravelParametersSection } from '../components/form/TravelParametersSection';
import { PersonnelManifestSection } from '../components/form/PersonnelManifestSection';
import { ExpenseAllocationSection } from '../components/form/ExpenseAllocationSection';
import { SignatoryMatrixSection } from '../components/form/SignatoryMatrixSection';
import { attApi, personnelApi, approverApi } from '../services/api';

export const CreateATTPage = () => {
  const navigate = useNavigate();
  const { referenceNo } = useParams();
  const isEditMode = Boolean(referenceNo);

  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personnelList, setPersonnelList] = useState([]);
  const [approverList, setApproverList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState([]);
  const [personnelError, setPersonnelError] = useState('');
  const [existingRecord, setExistingRecord] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      attType: 'Local',
      destination: '',
      travelStartDate: todayStr,
      travelEndDate: todayStr,
      periodOfTravel: '',
      officeStation: 'Commission on Higher Education - Central Office',
      purpose: '',
      travelClassification: 'Official Business',
      datePrepared: todayStr,
      requestedBy: { name: '', position: '', personnelId: '' },
      fundsAvailable: 'N/A',
      sourceOfFunds: '',
      expenses: { airfare: '', perDiem: '', preTravel: '', totalAmount: '' },
      paymentMode: '',
      approvedBy: { name: 'SHIRLEY C. AGRUPIS, Ph.D', position: 'Chairperson', approverId: '' }
    }
  });

  const attType = watch('attType');
  const destination = watch('destination');

  // Load Personnel, Approvers, and (if Edit Mode) existing record
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMasterData(true);
        const [pRes, aRes] = await Promise.all([
          personnelApi.getAll({ active: true }),
          approverApi.getAll({ active: true })
        ]);

        const pData = pRes.data || [];
        const aData = aRes.data || [];

        setPersonnelList(pData);
        setApproverList(aData);

        if (isEditMode) {
          const recRes = await attApi.getByRef(referenceNo);
          const rec = recRes.data;
          setExistingRecord(rec);

          // Populate form fields with existing record
          reset({
            attType: rec.attType || 'Local',
            destination: rec.destination || '',
            travelStartDate: rec.travelStartDate ? rec.travelStartDate.split('T')[0] : '',
            travelEndDate: rec.travelEndDate ? rec.travelEndDate.split('T')[0] : '',
            periodOfTravel: rec.periodOfTravel || '',
            officeStation: rec.officeStation || 'Commission on Higher Education - Central Office',
            purpose: rec.purpose || '',
            travelClassification: rec.travelClassification || 'Official Business',
            datePrepared: rec.datePrepared ? rec.datePrepared.split('T')[0] : todayStr,
            requestedBy: {
              name: rec.requestedBy?.name || '',
              position: rec.requestedBy?.position || '',
              personnelId: rec.requestedBy?.personnelId || ''
            },
            fundsAvailable: rec.fundsAvailable || 'N/A',
            sourceOfFunds: rec.sourceOfFunds || '',
            expenses: {
              airfare: rec.expenses?.airfare ?? '',
              perDiem: rec.expenses?.perDiem ?? '',
              preTravel: rec.expenses?.preTravel ?? '',
              totalAmount: rec.expenses?.totalAmount ?? '',
              airfareRaw: rec.expenses?.airfareRaw || '',
              perDiemRaw: rec.expenses?.perDiemRaw || '',
              preTravelRaw: rec.expenses?.preTravelRaw || '',
              totalAmountRaw: rec.expenses?.totalAmountRaw || ''
            },
            paymentMode: rec.paymentMode || '',
            approvedBy: {
              name: rec.approvedBy?.name || '',
              position: rec.approvedBy?.position || '',
              approverId: rec.approvedBy?.approverId || ''
            }
          });

          // Set existing personnel manifest
          if (rec.personnel && rec.personnel.length > 0) {
            setSelectedPersonnel(
              rec.personnel.map((p) => ({
                _id: p.personnelId || p._id,
                name: p.name,
                position: p.position,
                office: p.office
              }))
            );
          }
        } else {
          // Preselect default approver if available
          if (aData.length > 0) {
            const defaultApp = aData.find((a) => a.name.includes('AGRUPIS')) || aData[0];
            setValue('approvedBy.name', defaultApp.name);
            setValue('approvedBy.position', defaultApp.position);
            setValue('approvedBy.approverId', defaultApp._id);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error(err.message || 'Failed to load data from database');
      } finally {
        setLoadingMasterData(false);
      }
    };

    fetchData();
  }, [referenceNo, isEditMode, reset, setValue, todayStr]);

  const handleAddPersonnel = (person) => {
    setSelectedPersonnel((prev) => [...prev, person]);
    setPersonnelError('');
  };

  const handleRemovePersonnel = (index) => {
    setSelectedPersonnel((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData) => {
    if (selectedPersonnel.length === 0) {
      setPersonnelError('Please select at least one personnel for the manifest.');
      toast.error('Please select at least one personnel member.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        personnel: selectedPersonnel.map((p) => ({
          personnelId: p._id || p.personnelId,
          name: p.name,
          position: p.position,
          office: p.office || formData.officeStation
        }))
      };

      if (isEditMode && existingRecord) {
        await attApi.update(existingRecord._id || existingRecord.referenceNo, payload);
        toast.success(`ATT Record ${existingRecord.referenceNo} updated successfully!`);
        navigate(`/att/${existingRecord.referenceNo}`);
      } else {
        const response = await attApi.create(payload);
        const createdRecord = response.data;

        toast.success(`ATT Record generated: ${createdRecord.referenceNo}`);

        // Open print preview page
        const printType = createdRecord.attType === 'Abroad' ? 'abroad' : 'local';
        navigate(`/att/${createdRecord.referenceNo}/print/${printType}`);
      }
    } catch (err) {
      console.error('Save ATT Error:', err);
      toast.error(err.message || 'Failed to save ATT record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-chedNavy via-[#0f315a] to-chedBlue p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-chedNavy/10 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4">
          {isEditMode ? <Edit3 className="w-36 h-36 text-white" /> : <FilePlus className="w-36 h-36 text-white" />}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/10 text-chedGold text-2xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-white/15">
              {isEditMode ? `Editing Record: ${referenceNo}` : 'Office of Commissioner Apag • Official Form'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit3 className="w-8 h-8 text-amber-400" />
                Edit Authority to Travel (ATT)
              </>
            ) : (
              <>
                <FilePlus className="w-8 h-8 text-chedGold" />
                Create Authority to Travel (ATT)
              </>
            )}
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm mt-1">
            {isEditMode
              ? `Update travel parameters, personnel manifest, expenses, or signatories for ${referenceNo}.`
              : 'Complete the official travel parameters, personnel manifest, and signatory matrix.'}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="relative z-10 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEditMode ? 'Cancel / Back' : 'Back to Dashboard'}
        </button>
      </div>

      {/* 4-Step Form Process Visual Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/90 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-3 p-2 bg-blue-50/60 rounded-xl border border-blue-100">
          <div className="w-7 h-7 rounded-lg bg-chedBlue text-white font-black text-xs flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <div className="font-extrabold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-chedBlue" /> Parameters
            </div>
            <div className="text-[10px] text-slate-500 truncate">{destination || 'Destination & Dates'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <div className="font-extrabold text-slate-800 flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-600" /> Manifest
            </div>
            <div className="text-[10px] text-slate-500">{selectedPersonnel.length} personnel added</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <div className="font-extrabold text-slate-800 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-600" /> Expenses
            </div>
            <div className="text-[10px] text-slate-500">Fund Sources</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-amber-50/60 rounded-xl border border-amber-100">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            4
          </div>
          <div>
            <div className="font-extrabold text-slate-800 flex items-center gap-1">
              <PenTool className="w-3 h-3 text-amber-600" /> Signatories
            </div>
            <div className="text-[10px] text-slate-500">Recommending & Approval</div>
          </div>
        </div>
      </div>

      {loadingMasterData ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-chedBlue mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Loading master personnel data from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TravelParametersSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <PersonnelManifestSection
            personnelList={personnelList}
            selectedPersonnel={selectedPersonnel}
            onAddPersonnel={handleAddPersonnel}
            onRemovePersonnel={handleRemovePersonnel}
            error={personnelError}
          />

          <ExpenseAllocationSection
            register={register}
            watch={watch}
            setValue={setValue}
            attType={attType}
          />

          <SignatoryMatrixSection
            register={register}
            watch={watch}
            setValue={setValue}
            personnelList={personnelList}
            approverList={approverList}
          />

          {/* Form Actions Footer Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-800">
                {isEditMode ? 'Ready to Update:' : 'Form Ready:'}
              </span>{' '}
              {isEditMode ? 'Verify updated details and click Save Changes.' : 'Check all details before generating the official document.'}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto text-white rounded-xl px-8 py-3.5 font-extrabold text-xs sm:text-sm tracking-wide shadow-lg transition-all duration-150 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditMode
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Saving Changes...' : 'Generating ATT Record...'}
                </>
              ) : isEditMode ? (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5" />
                  Generate ATT Record
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

