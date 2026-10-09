const REQUIRED_BASE=['SIL_TEST','HIL_TEST','VEHICLE_TEST','CYBERSECURITY_REVIEW','ROLLBACK_TEST','RELEASE_NOTES'];
const unique=x=>[...new Set(x||[])];
export function validateCampaign(x){const e=[];for(const k of ['name','release','owner','vehicleProgramme'])if(!x?.[k]?.trim())e.push(`${k} is required.`);return e}
export function validatePackage(x){const e=[];for(const k of ['name','version','ecu','checksum'])if(!x?.[k]?.trim())e.push(`${k} is required.`);return e}
export function requiredEvidence(c){return unique([...REQUIRED_BASE,...(c.safetyRelevant?['SAFETY_REVIEW']:[]),...(c.regulatedMarket?['COMPLIANCE_REVIEW']:[]),...(c.personalData?['PRIVACY_REVIEW']:[])])}
export function evaluate(c,now=new Date()){
 const findings=[],packages=c.packages||[],cohorts=c.cohorts||[],evidence=c.evidence||[],gates=c.gates||[];
 const req=requiredEvidence(c),approvedTypes=unique(evidence.filter(x=>x.status==='APPROVED'&&(!x.validUntil||new Date(x.validUntil)>=now)).map(x=>x.type)),missing=req.filter(x=>!approvedTypes.includes(x));
 if(!packages.length)findings.push({severity:'critical',area:'Manifest',title:'Release manifest is empty',action:'Add every deployable package and dependency.'});
 const unsigned=packages.filter(x=>!x.signed);if(unsigned.length)findings.push({severity:'critical',area:'Supply chain',title:`${unsigned.length} packages are not signed`,action:'Provide verified signatures for all packages.'});
 const noRollback=packages.filter(x=>!x.rollbackVersion);if(noRollback.length)findings.push({severity:'high',area:'Rollback',title:`${noRollback.length} packages lack rollback versions`,action:'Define compatible rollback packages and dependencies.'});
 const duplicate=packages.filter((x,i,a)=>a.findIndex(y=>y.ecu===x.ecu&&y.name===x.name)!==i);if(duplicate.length)findings.push({severity:'high',area:'Manifest',title:'Duplicate package/ECU entries detected',action:'Resolve manifest ambiguity before approval.'});
 if(!cohorts.length)findings.push({severity:'high',area:'Rollout',title:'No target cohorts defined',action:'Define pilot and production rollout rings.'});
 const noPilot=cohorts.length&&!cohorts.some(x=>x.ring==='PILOT');if(noPilot)findings.push({severity:'high',area:'Rollout',title:'Pilot cohort is missing',action:'Define a representative pilot ring before scale-up.'});
 const invalidCohorts=cohorts.filter(x=>Number(x.vehicleCount)<=0||!x.variants?.length);if(invalidCohorts.length)findings.push({severity:'high',area:'Rollout',title:`${invalidCohorts.length} cohorts are incomplete`,action:'Specify positive vehicle count and affected variants.'});
 if(missing.length)findings.push({severity:'critical',area:'Evidence',title:`${missing.length} required evidence types are missing`,action:`Provide approved evidence: ${missing.join(', ')}.`});
 const expired=evidence.filter(x=>x.validUntil&&new Date(x.validUntil)<now);if(expired.length)findings.push({severity:'high',area:'Evidence',title:`${expired.length} evidence records are expired`,action:'Refresh evidence or exclude it from the release case.'});
 const failed=gates.filter(x=>x.status==='FAILED');if(failed.length)findings.push({severity:'critical',area:'Release gates',title:`${failed.length} gates failed`,action:'Resolve failed gates and rerun review.'});
 const open=gates.filter(x=>x.status==='OPEN');if(open.length)findings.push({severity:'high',area:'Release gates',title:`${open.length} gates remain open`,action:'Close all mandatory release gates.'});
 const blockers=findings.filter(x=>x.severity==='critical'||x.severity==='high').length;
 const coverage=req.length?Math.round((req.length-missing.length)/req.length*100):0;
 const decision=blockers?'HOLD':(packages.length&&cohorts.length&&coverage===100?'READY_FOR_RELEASE_REVIEW':'IN_PROGRESS');
 return {generatedAt:now.toISOString(),decision,metrics:{packages:packages.length,signedPackages:packages.length-unsigned.length,cohorts:cohorts.length,targetVehicles:cohorts.reduce((s,x)=>s+Number(x.vehicleCount||0),0),requiredEvidence:req.length,evidenceCoverage:coverage,failedGates:failed.length,openGates:open.length},requiredEvidence:req,missingEvidence:missing,findings,disclaimer:'Decision support only. Deployment and approval remain the responsibility of authorised programme personnel.'};
}
