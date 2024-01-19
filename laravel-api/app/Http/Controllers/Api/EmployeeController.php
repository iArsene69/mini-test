<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Storage;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();

        return new EmployeeResource($employees, 200, "Employees retrieved successfully");
    }

    public function store(Request $request)
    {

        // return response()->json($request->all(), 400);
        $validator = Validator::make($request->all(), [
            // 'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'name' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'dob' => 'required',
            'position' => 'required',
            'salary' => 'required',
            'join_date' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('profile_picture')) {
            $profile_pic = $request->file('profile_picture');
            $profile_pic->storeAs('public/profile_pictures', $profile_pic->hashName());


            Employee::create([
                'profile_picture' => $profile_pic->hashName(),
                'name' => $request->name,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'position' => $request->position,
                'salary' => $request->salary,
                'join_date' => $request->join_date,
            ]);


        } else {
            Employee::create([
                'name' => $request->name,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'position' => $request->position,
                'salary' => $request->salary,
                'join_date' => $request->join_date,
            ]);
        }

        return new EmployeeResource(null, 201, "Employee created successfully");
    }

    public function show($id)
    {
        $employee = Employee::find($id);

        return new EmployeeResource($employee, 200, "Employee retrieved successfully");
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'dob' => 'required',
            'position' => 'required',
            'salary' => 'required',
            'join_date' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $employee = Employee::find($id);

        if ($request->hasFile('profile_picture')) {
            $profile_pic = $request->file('profile_picture');
            $profile_pic->storeAs('public/profile_pictures', $profile_pic->hashName());

            Storage::delete('public/profile_pictures/' . basename($employee->profile_picture));

            $employee->update([
                'profile_picture' => $profile_pic->hashName(),
                'name' => $request->name,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'position' => $request->position,
                'salary' => $request->salary,
                'join_date' => $request->join_date,
            ]);


        } else {
            $employee->update([
                'name' => $request->name,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'position' => $request->position,
                'salary' => $request->salary,
                'join_date' => $request->join_date,
            ]);
        }

        return new EmployeeResource(null, 200, "Employee updated successfully");
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);
        Storage::delete('public/profile_pictures/' . basename($employee->profile_picture));
        $employee->delete();

        return new EmployeeResource(null, 200, "Employee deleted successfully");
    }
}
